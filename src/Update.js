import * as R from 'ramda';

const msgs = {
    show_form: 'show_form',
    meal_input: 'meal_input',
    calories_input: 'calories_input',
    save_meal: 'save_meal',
    delete_meal: 'delete_meal',
    edit_meal: 'edit_meal',
};

export function showFormMsg(showForm) {
    return {
        type: msgs.show_form,
        showForm,
    };
}

export function mealInputMsg(description) {
    return {
        type: msgs.meal_input,
        description,
    };
}

export function caloriesInputMsg(calories) {
    return {
        type: msgs.calories_input,
        calories,
    };
}

export const saveMealMsg = {
    type: msgs.save_meal,
};

export function deleteMealMsg(id) {
    return {
        type: msgs.delete_meal,
        id,
    };
}

export function editMealMsg(editId) {
    return {
        type: msgs.edit_meal,
        editId,
    };
}

function update(msg, model) {
    switch (msg.type) {
        case msgs.show_form: {
            const { showForm } = msg;
            return { ...model, showForm, description: '', calories: 0 };
        }
        case msgs.meal_input: {
            const { description } = msg;
            return { ...model, description };
        }
        case msgs.calories_input: {
            const calories = R.pipe(
                parseInt,
                R.defaultTo(0)
            )(msg.calories);
            return { ...model, calories };
        }
        case msgs.save_meal: {
            const { editId } = model;
            const updatedModel =
                editId !== null ? edit(msg, model) : add(msg, model);
            return updatedModel;
        }
        case msgs.delete_meal: {
            const { id } = msg;
            const meals = R.filter(meal => meal.id !== id, model.meals);
            return { ...model, meals };
        }
        case msgs.edit_meal: {
            const { editId } = msg;
            const meal = R.find(meal => meal.id === editId, model.meals);
            const { description, calories } = meal;
            return {
                ...model,
                editId,
                description,
                calories,
                showForm: true,
            };
        }
    }
    return model;
}

function add(msg, model) {
    const { nextId, description, calories } = model;
    const meal = { id: nextId, description, calories };
    const meals = [...model.meals, meal];
    return {
        ...model,
        meals,
        nextId: nextId + 1,
        description: '',
        calories: 0,
        showForm: false,
    };
}

function edit(msg, model) {
    const { description, calories, editId } = model;
    const meals = R.map(meal => {
        if (meal.id === editId) {
            return { ...meal, description, calories };
        }
        return meal;
    }, model.meals);
    return {
        ...model,
        meals,
        description: '',
        calories: 0,
        showForm: false,
        editId: null,
    };
}

export default update;
