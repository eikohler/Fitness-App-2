import { Alert, ScrollView, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ModalBar from '@/components/ModalBar';
import { mainStyles } from '@/styles/Styles';
import Header from '@/components/Header';
import EditWorkoutButton, { EditWorkoutRef } from '@/components/EditWorkoutButton';
import PlusButton from '@/components/PlusButton';
import LargeButton from '@/components/LargeButton';
import { useSQLiteContext } from 'expo-sqlite';
import { IDList } from '@/Interfaces/dataTypes';
import { addMultipleWorkouts, deleteMultipleWorkouts, getWorkouts } from '@/utilities/db-functions';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated'
import { moveItemToIndex } from '@/utilities/helpers';

export default function EditWorkoutsOld() {
  const db = useSQLiteContext();
  const [initWorkouts, setInitWorkouts] = useState<IDList[]>([]);
  const [workouts, setWorkouts] = useState<IDList[]>([]);
  const [hasUpdate, setHasUpdate] = useState(false);
  const hasUpdateRef = useRef(hasUpdate);
  const workoutRefs = useRef<React.RefObject<EditWorkoutRef>[]>([]);
  const scroll = useRef<ScrollView>(null);
  const [textFocused, setTextFocused] = useState(-1);
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigation = useNavigation();
  const [renderKey, setRenderKey] = useState(0); // To re-render the workout button refs

  useEffect(() => {
    hasUpdateRef.current = hasUpdate;
  }, [hasUpdate]);

  useEffect(() => {
    getWorkouts(db)
      .then((res) => {
        if (res) {
          setWorkouts(res);
          setInitWorkouts(res);
        }
      }).catch(console.log);
  }, []);

  useEffect(() => {
    workoutRefs.current = workouts.map((_, i) => workoutRefs.current[i] || React.createRef<EditWorkoutRef>());
    console.log(workouts);
    setRenderKey(renderKey + 1);
  }, [workouts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasUpdateRef.current) return;
      e.preventDefault();
      Alert.alert(
        'Discard changes?',
        "If you go back now, you'll lose your changes.",
        [
          { text: 'Keep editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });
    return unsubscribe;
  }, [navigation]);

  const handleAddWorkout = () => {
    const newID = Math.max(...workouts.map(w => w.id), 0) + 1;
    setWorkouts([...workouts, { id: newID }]);
    setHasUpdate(true);
  };

  const handleRemoveWorkout = (id: number) => {
    setWorkouts(workouts.filter(w => w.id !== id));
    setHasUpdate(true);
  };

  const handleSaveWorkouts = () => {
    console.log("Workout Refs: ", workoutRefs.current);
    const workoutData = workoutRefs.current.map((ref, i) => {
      const values = ref.current?.getValues();
      return {
        id: workouts[i].id,
        title: values?.title ?? '',
        note: values?.note ?? '',
      };
    });

    const missingWorkouts = initWorkouts.filter(workout => !workouts.includes(workout));

    console.log("Saving workouts:", workoutData);
    addMultipleWorkouts(db, workoutData);
    deleteMultipleWorkouts(db, missingWorkouts);
    setHasUpdate(false);
  };

  const updateTextFocused = (index: number) => {
    setTextFocused(index);
  };

  const updateHeaderHeight = (height: number) => setHeaderHeight(height);

  const scrollToComponent = (index: number) => {
    const component = workoutRefs.current[index]?.current;
    if (component) {
      component.measure((x, y) => {
        scroll.current?.scrollTo({ y: y - 10, animated: true });
      });
    }
  };

  const handleContentSizeChange = () => {
    if (textFocused > -1) scrollToComponent(textFocused);
  };

  const translateY = useSharedValue(0);

  const modalGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        runOnJS(navigation.goBack)();
      }
      translateY.value = withSpring(0, {
        damping: 10,
        stiffness: 120,
        mass: 0.4,
        overshootClamping: false,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleDragUpdate = async (pageY: number, direction: number, height: number, index: number) => {
    if(workoutRefs.current && workoutRefs.current.length){

      const refsArr = direction > 0 ? [...workoutRefs.current].reverse() : workoutRefs.current;

      for (const ref of refsArr) {

        const values = ref.current?.getValues();

        if(!values?.buttonWrapperY || !values.height) continue;

        let overIndex = index;
        const buttonMidY = values.buttonWrapperY + (values.height / 2);

        console.log(direction);

        if(direction > 0){

          if((pageY + height) >= buttonMidY) overIndex = values.index;

        }else{

          if(pageY <= buttonMidY) overIndex = values.index;

        }

        if(overIndex !== index){
          console.log("Index of overlap: ", overIndex);
          setWorkouts(prev => moveItemToIndex(prev, index, overIndex));          
          break;
        }
        
      }
    }
  }

  const buttonListRef = useRef<View>(null);

  return (
    <GestureDetector gesture={modalGesture}>
      <Animated.View style={[animatedStyle, mainStyles.modalWrapper]}>
        <Header headerHeight={headerHeight} updateHeaderHeight={updateHeaderHeight}
          title={'Workouts'} subtext={'Week 3'} bolt modal backBtn />

        <ModalBar />

        <ScrollView ref={scroll} contentContainerStyle={[
          mainStyles.wrapper,
          { paddingTop: headerHeight }
        ]} showsVerticalScrollIndicator={false}>

          <View style={{display: "flex", gap: 40}}>

            <View ref={buttonListRef} style={[
              mainStyles.editButtonsList,
              textFocused > -1 && mainStyles.focusedWrapper
            ]} onLayout={handleContentSizeChange}>

              {workouts.map((w, i) => (
                <EditWorkoutButton
                  key={w.id}
                  ref={workoutRefs.current[i]}
                  id={w.id}
                  index={i}
                  handleRemoveWorkout={handleRemoveWorkout}
                  updateTextFocused={updateTextFocused}
                  handleDragUpdate={handleDragUpdate}
                />
              ))}

            </View>

            <PlusButton textFocused={textFocused} onPress={handleAddWorkout} modal />

          </View>

          <LargeButton textFocused={textFocused} text="Save Workouts" action={handleSaveWorkouts} />

        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}
