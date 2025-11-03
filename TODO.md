# FITNESS APP PROGRESS

## FEATURES
### START SCREEN
- [x] Show Add workout button 
- [x] Show Workouts
- [x] Load workouts from DB
- [x] Show new workout changes from edit screen save

### EDIT SCREEN
- [x] Drag and Reorder Exercises within workout
- [x] Drag Exercise to other workout
- [x] Add tap and hold drag icons for exercises
- [x] Auto scroll on drag
- [x] Remove scroll bar
- [x] Add left side press and hold drag icons for workouts
- [x] On gesture start condense the workout
- [x] Drag and reorder workouts
- [x] Optimize drag and reorder
- [x] Reset the popup when visible is null
- [x] Change exercises and workouts to use UUID instead of integers
- [x] Add new exercise to workout
- [x] Add sets and reps data to exercises
- [x] Save workouts to DB
- [x] Edit workout title
- [x] On Save, go back to start screen
- [ ] Only allow SAVE if changes were made
- [ ] On cancel, IF changes made, add are you sure popup
- [ ] Add workout button
- [ ] Delete workout button
- [ ] Delete exercise button


## BUGS
### EDIT SCREEN
- [x] FIX: exercise drag with scrolling
- [x] FIX: Drag exercise POST workouts reorder updates
- [x] FIX: Drag drop EXERCISES while auto scrolling 
- [x] FIX: Load workouts from DB race condition for workout undefined vs is array
- [ ] FIX: Drag drop WORKOUTS while auto scrolling
- [ ] FIX: When plus button pressed, clears the workout title changes
- [ ] FIX: Notes not saving in the edit/create exercise modal popup