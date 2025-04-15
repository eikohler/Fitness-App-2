import { InteractionManager, ScrollView, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ModalBar from '@/components/ModalBar'
import { mainStyles } from '@/styles/Styles'
import Header from '@/components/Header'
import EditWorkoutButton from '@/components/EditWorkoutButton'
import PlusButton from '@/components/PlusButton'
import LargeButton from '@/components/LargeButton'
import { useSQLiteContext } from 'expo-sqlite'
import { IDList } from '@/Interfaces/dataTypes'
import { getWorkouts } from '@/utilities/db-functions'

export default function EditWorkouts() {

  const db = useSQLiteContext();

  const [workouts, setWorkouts] = useState<IDList[]>([]);

  useEffect(() => {
    getWorkouts(db)
      .then((res) => {
        if (res) {
          setWorkouts(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAddWorkout = () => {
    const idArray = workouts.map((w) => w.id);
    const newID = Math.max(...idArray) + 1;
    setWorkouts([...workouts, { id: newID }]);
  }

  const handleRemoveWorkout = (id: number) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  }

  const [headerHeight, setHeaderHeight] = useState(0);

  const updateHeaderHeight = (height: number) => setHeaderHeight(height);

  const [textFocused, setTextFocused] = useState(-1);

  const updateTextFocused = (index: number) => {
    setTextFocused(index);
  }

  const scroll = useRef<ScrollView>(null);
  const workoutBtns = useRef<View[]>([]);

  useEffect(() => {
    workoutBtns.current = workoutBtns.current.slice(0, workouts.length);
  }, [workouts]);


  const scrollToComponent = (index: number) => {
    if (workoutBtns.current[index]) {
      workoutBtns.current[index].measure((x, y) => {        
        scroll.current?.scrollTo({ y: y-10, animated: true });
      });
    }
  };

  const handleContentSizeChange = () =>{
    if(textFocused > -1) scrollToComponent(textFocused);
  }

  useEffect(()=>{
    if(textFocused > -1) scrollToComponent(textFocused);
  }, [textFocused]);

  return (
    <>
      <Header headerHeight={headerHeight} updateHeaderHeight={updateHeaderHeight}
        title={'Workouts'} subtext={'Week 3'} bolt modal backBtn />

      <ModalBar />

      <ScrollView ref={scroll} contentContainerStyle={[
        mainStyles.wrapper,
        { paddingTop: headerHeight }        
      ]} showsVerticalScrollIndicator={false}>

        <View style={[mainStyles.buttonsList, textFocused > -1 && mainStyles.focusedWrapper]} 
        onLayout={handleContentSizeChange}>
          {workouts.map((w, i) => (
            <View key={w.id} ref={(el) => {
              if (el) workoutBtns.current[i] = el;
            }}>
              <EditWorkoutButton
                id={w.id}
                index={i}
                handleRemoveWorkout={handleRemoveWorkout}
                updateTextFocused={updateTextFocused}
              />
            </View>
          ))}
          <PlusButton onPress={handleAddWorkout} modal />
        </View>

        <LargeButton text="Save Workouts" />

      </ScrollView>
    </>
  )
}