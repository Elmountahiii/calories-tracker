// Action Buttons
const dailyLimitButton = document.querySelector(".daily-limit-button");
const resetDayButton = document.querySelector(".reset-day-button");

// Model items
const model = document.querySelector(".model");
const modelSaveButton = document.querySelector(".model-button");
const closeModelButton = document.querySelector(".model-close-button");
const modelInput = document.querySelector("#model-input");

// main
const userDailyLimit = document.querySelector(".user-daily-limit");
const userGainAndLost = document.querySelector(".user-gain-lost");
const userConsumedCalories = document.querySelector(".user-consumed-calories");
const userBurnedCalories = document.querySelector(".user-burned-calories");
const userRemainingCalories = document.querySelector(
  ".user-remaining-calories"
);

// Interaction section
// filter Inputs
const mealsFilterInput = document.querySelector(".meal-filter-input");
const workoutFilterInput = document.querySelector(".workout-filter-input");
// Buttons
const addMealButton = document.querySelector(".add-meal-button");
const addWorkoutButton = document.querySelector(".add-workout-button");
// inputs Sections
const mealInputSection = document.querySelector(".meal-input-section");
const workInputSection = document.querySelector(".workout-input-section");

// inputs
// Meals
const mealTitleInput = document.querySelector(".meal-title");
const mealCaloriesInput = document.querySelector(".meal-calories");
// workouts
const workoutTitleInput = document.querySelector(".workout-title");
const workoutCaloriesInput = document.querySelector(".workout-calories");

// inputs Buttons
const saveMealButton = document.querySelector(".save-meal");
const saveWorkoutButton = document.querySelector(".save-workout");

// list containers
const mealListContainer = document.querySelector(".meal-list-container");
const workoutListContainer = document.querySelector(".workout-list-container");

// constants
const mealsDatabaseName = "MealDataBase";
const workoutsDatabaseName = "workoutDataBase";
const userDataBaseName = "userDataBase";

// Events
document.addEventListener("DOMContentLoaded", initDatabase);
dailyLimitButton.addEventListener("click", setDailyLimit);
resetDayButton.addEventListener("click", resetDay);
closeModelButton.addEventListener("click", closeModel);
modelSaveButton.addEventListener("click", getDailyLimit);
addMealButton.addEventListener("click", showMealInput);
addWorkoutButton.addEventListener("click", showWorkoutInput);
saveMealButton.addEventListener("click", saveMeal);
saveWorkoutButton.addEventListener("click", saveWorkout);
mealListContainer.addEventListener("click", removeMeal);
workoutListContainer.addEventListener("click", removeWorkout);

function removeMeal(e) {
  if (e.target.classList[0] == "item-delete-button") {
    const mealTitle = e.target.parentElement.firstChild.innerText;
    removeMealFromDB(mealTitle);
    e.target.parentElement.remove();
  }
}

function removeMealFromDB(mealTitle) {
  const meals = getDataBase(mealsDatabaseName);

  // console.log(mealTitle);

  const originalMeal = meals.filter((meal) => {
    return meal.title == mealTitle;
  });
  console.log(originalMeal);

  calculateConsumedCalories(originalMeal[0].caloriesCount, { type: "remove" });

  const newMeals = meals.filter((meal) => {
    return meal.title != mealTitle;
  });

  localStorage.setItem(mealsDatabaseName, JSON.stringify(newMeals));
}

function removeWorkout(e) {
  if (e.target.classList[0] == "item-delete-button") {
    const workoutTitle = e.target.parentElement.firstChild.innerText;
    removeWorkoutFromDB(workoutTitle);
    e.target.parentElement.remove();
  }
}

function removeWorkoutFromDB(workoutTitle) {
  const workouts = getDataBase(workoutsDatabaseName);

  // console.log(mealTitle);

  const originalWorkout = workouts.filter((workout) => {
    return workout.title == workoutTitle;
  });

  calculateBurnedCalories(originalWorkout[0].caloriesCount, { type: "remove" });

  const newWorkouts = workouts.filter((workouts) => {
    return workouts.title != workoutTitle;
  });

  localStorage.setItem(workoutsDatabaseName, JSON.stringify(newWorkouts));
}

// header Functions

function setDailyLimit() {
  showModel();
}
function resetDay() {
  clearUI();
}

function clearUI() {
  userGainAndLost.innerText = "0";
  userConsumedCalories.innerText = "0";
  userBurnedCalories.innerText = "0";
  userDailyLimit.innerText = "2000";
  userRemainingCalories.innerText = userDailyLimit.innerText;
  mealListContainer.innerHTML = "";
  workoutListContainer.innerHTML = "";
  saveUserData();
  removeSavedMealsANdWorkouts();
}

function removeSavedMealsANdWorkouts() {
  const emptyArray = [];
  localStorage.setItem(mealsDatabaseName, JSON.stringify(emptyArray));
  localStorage.setItem(workoutsDatabaseName, JSON.stringify(emptyArray));
}

// Model Functions
function showModel() {
  model.classList.remove("hide");
}

function closeModel() {
  modelInput.value = "";
  model.classList.add("hide");
}

//  show and hide Inputs sections
function showMealInput() {
  if (getComputedStyle(mealInputSection).display === "none") {
    mealInputSection.style.display = "flex";
  } else {
    mealInputSection.style.display = "none";
  }
}

function showWorkoutInput() {
  if (getComputedStyle(workInputSection).display === "none") {
    workInputSection.style.display = "flex";
  } else {
    workInputSection.style.display = "none";
  }
}

// Main Section Functions

function getDailyLimitInput() {
  return modelInput.value;
}

function setDailyCaloriesLimit(limit) {
  userDailyLimit.innerText = limit;
  userRemainingCalories.innerHTML = limit;
  saveUserData();
}

// Meal Functions

function saveMeal() {
  if (mealTitleInput.value != "" && mealCaloriesInput.value != "") {
    const mealTitle = mealTitleInput.value;
    const mealCaloriesCount = mealCaloriesInput.value;

    createMeal(mealTitle, mealCaloriesCount);
    saveToDatabase(mealTitle, mealCaloriesCount, mealsDatabaseName);
    showMealInput();
    const operation = {
      type: "add",
    };
    calculateConsumedCalories(mealCaloriesCount, operation);
  } else {
    alert("Please Enter valid Meal Information");
  }

  // console.log(`${mealTitle} - ${mealCaloriesCount}`);
}

function createMeal(mealTitle, mealCaloriesCount) {
  const div = document.createElement("div");
  div.classList.add("list-item");

  // meal Title
  const title = document.createElement("h1");
  title.classList.add("item-meal-title");
  title.innerText = mealTitle;

  // meal count
  const count = document.createElement("h1");
  count.classList.add("item-meal-calories-count");
  count.classList.add("Calories-count");
  count.innerText = mealCaloriesCount;

  // Delate Button

  const delateButton = document.createElement("ion-icon");
  delateButton.classList.add("item-delete-button");
  delateButton.setAttribute("name", "close-outline");

  div.append(title);
  div.append(count);
  div.append(delateButton);
  mealListContainer.append(div);
}

function saveWorkout() {
  if (workoutTitleInput.value != "" && workoutCaloriesInput.value != "") {
    const workoutTitle = workoutTitleInput.value;
    const workoutCaloriesCount = workoutCaloriesInput.value;

    createWorkout(workoutTitle, workoutCaloriesCount);
    saveToDatabase(workoutTitle, workoutCaloriesCount, workoutsDatabaseName);
    showWorkoutInput();
    const operation = {
      type: "add",
    };
    calculateBurnedCalories(workoutCaloriesCount, operation);
  } else {
    alert("Please Enter valid workout Information");
  }
}

function createWorkout(workoutTitle, workoutCaloriesCount) {
  const div = document.createElement("div");
  div.classList.add("list-item");

  // workout Title
  const title = document.createElement("h1");
  title.classList.add("item-workout-title");
  title.innerText = workoutTitle;

  // meal count
  const count = document.createElement("h1");
  count.classList.add("item-workout-calories-count");
  count.classList.add("Calories-count");
  count.innerText = workoutCaloriesCount;

  // Delate Button

  const delateButton = document.createElement("ion-icon");
  delateButton.classList.add("item-delete-button");
  delateButton.setAttribute("name", "close-outline");

  div.append(title);
  div.append(count);
  div.append(delateButton);
  workoutListContainer.append(div);
}

// Calculation
function calculateBurnedCalories(caloriesCount, operation) {
  if (operation.type == "add") {
    const user = getUserData();
    const caloriesToAdd = parseInt(caloriesCount);

    user.caloriesBurned = parseInt(user.caloriesBurned) + caloriesToAdd;
    user.remainingCalories = parseInt(user.remainingCalories) + caloriesToAdd;
    user.dayScore = parseInt(user.caloriesConsumed) - caloriesToAdd;
    updateUserData(user);
  } else if (operation.type == "remove") {
    const user = getUserData();
    const caloriesToRemove = parseInt(caloriesCount);

    user.caloriesBurned = parseInt(user.caloriesBurned) - caloriesToRemove;
    user.remainingCalories =
      parseInt(user.remainingCalories) - caloriesToRemove;
    user.dayScore = parseInt(user.dayScore) + caloriesToRemove;
    updateUserData(user);
  }
}

function calculateConsumedCalories(caloriesCount, operation) {
  if (operation.type == "add") {
    const user = getUserData();
    const caloriesToMinus = parseInt(caloriesCount);

    user.caloriesConsumed = parseInt(user.caloriesConsumed) + caloriesToMinus;
    user.remainingCalories = parseInt(user.remainingCalories) - caloriesToMinus;
    user.dayScore = parseInt(user.dayScore) + caloriesToMinus;
    updateUserData(user);
  } else if (operation.type == "remove") {
    const user = getUserData();
    const caloriesToAdd = parseInt(caloriesCount);
    console.log(`the meal calories are :${caloriesCount}`);

    console.log(
      `Consumed Calories before calculation in the DOM are : ${userConsumedCalories.innerText}.\n in the DB are ${user.caloriesConsumed}`
    );
    console.log(
      `now we want to minus the meal calories ${caloriesToAdd} from consumed calories ${
        user.caloriesConsumed
      }: ${parseInt(user.caloriesConsumed) - caloriesToAdd}`
    );
    user.caloriesConsumed = parseInt(user.caloriesConsumed) - caloriesToAdd;
    user.remainingCalories = parseInt(user.remainingCalories) + caloriesToAdd;
    user.dayScore = parseInt(user.dayScore) - caloriesToAdd;
    updateUserData(user);
  }
}

// Important Functions

function getDailyLimit() {
  if (getDailyLimitInput() !== "") {
    setDailyCaloriesLimit(getDailyLimitInput());
  }
  closeModel();
}

// localStorage

function initDatabase() {
  const mealsList = getDataBase(mealsDatabaseName);
  const workoutsList = getDataBase(workoutsDatabaseName);
  const user = getUserData();

  if (user != null) {
    userDailyLimit.innerText = user.dailyLimit;
    userGainAndLost.innerText = user.dayScore;
    userBurnedCalories.innerText = user.caloriesBurned;
    userConsumedCalories.innerText = user.caloriesConsumed;
    userRemainingCalories.innerText = user.remainingCalories;
  } else {
    saveUserData();
  }

  mealsList.forEach((meal) => {
    createMeal(meal.title, meal.caloriesCount);
  });

  workoutsList.forEach((workout) => {
    createWorkout(workout.title, workout.caloriesCount);
  });

  // console.log(parseInt("10") - parseInt("15"));
}

function saveToDatabase(title, caloriesCount, dbName) {
  const dataBase = getDataBase(dbName);

  const itemObject = {
    title,
    caloriesCount,
  };

  dataBase.push(itemObject);
  localStorage.setItem(dbName, JSON.stringify(dataBase));
}

function getDataBase(databaseName) {
  return JSON.parse(localStorage.getItem(databaseName) || "[]");
}

function getUserData() {
  return JSON.parse(localStorage.getItem(userDataBaseName));
}

function saveUserData() {
  const userData = {
    dailyLimit: userDailyLimit.innerText,
    dayScore: userGainAndLost.innerText,
    caloriesConsumed: userConsumedCalories.innerText,
    caloriesBurned: userBurnedCalories.innerText,
    remainingCalories: userRemainingCalories.innerText,
  };

  localStorage.setItem(userDataBaseName, JSON.stringify(userData));
}

function updateUserData(user) {
  localStorage.setItem(userDataBaseName, JSON.stringify(user));
  updateUi();
}

function updateUi() {
  const user = getUserData();

  userDailyLimit.innerText = user.dailyLimit;
  userGainAndLost.innerText = user.dayScore;
  userBurnedCalories.innerText = user.caloriesBurned;
  userConsumedCalories.innerText = user.caloriesConsumed;
  userRemainingCalories.innerText = user.remainingCalories;
}
