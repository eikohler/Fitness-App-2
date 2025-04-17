import { Alert, ScrollView, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ModalBar from '@/components/ModalBar';
import { mainStyles } from '@/styles/Styles';
import Header from '@/components/Header';
import EditWorkoutButton from '@/components/EditWorkoutButton';
import PlusButton from '@/components/PlusButton';
import LargeButton from '@/components/LargeButton';
import { useSQLiteContext } from 'expo-sqlite';
import { IDList } from '@/Interfaces/dataTypes';
import { getWorkouts } from '@/utilities/db-functions';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated'

export default function EditWorkouts() {

  const db = useSQLiteContext();

  const [workouts, setWorkouts] = useState<IDList[]>([]);

  const [hasUpdate, setHasUpdate] = useState(false);

  const hasUpdateRef = useRef(hasUpdate);

  useEffect(() => {
    hasUpdateRef.current = hasUpdate;
  }, [hasUpdate]);

  useEffect(() => {
    getWorkouts(db)
      .then((res) => {
        if (res) {
          setWorkouts(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const navigation = useNavigation();

  // Runs before user is navigated away from the page
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {

      if (!hasUpdateRef.current) return;

      e.preventDefault();

      Alert.alert(
        'Discard changes?',
        "If you go back now, you'll lose your changes.",
        [
          { text: 'Keep editing', style: 'cancel', onPress: () => { } },
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
    const idArray = workouts.map((w) => w.id);
    const newID = Math.max(...idArray) + 1;
    setWorkouts([...workouts, { id: newID }]);
    setHasUpdate(true);
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
        scroll.current?.scrollTo({ y: y - 10, animated: true });
      });
    }
  };

  const handleContentSizeChange = () => {
    if (textFocused > -1) scrollToComponent(textFocused);
  }

  // Create a shared value to track the translation
  const translateY = useSharedValue(0); // Track the vertical translation (thumb swipe)

  // Gesture handler to update the translation
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        runOnJS(navigation.goBack)(); // Ensures navigation is called on the JS thread
      }
      translateY.value = withSpring(0, {
        damping: 10,     // Lower damping = more bounce
        stiffness: 120,  // You can increase this for snappier feel
        mass: 0.4,       // Optional: lower mass for more bounce effect
        overshootClamping: false, // Allow overshoot
      });
    });


  // Animated style to apply the translation to the modal
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }], // Apply the translationY value to move the modal
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle, mainStyles.modalWrapper]}>
        <Header headerHeight={headerHeight} updateHeaderHeight={updateHeaderHeight}
          title={'Workouts'} subtext={'Week 3'} bolt modal backBtn />

        <ModalBar />

        <ScrollView ref={scroll} contentContainerStyle={[
          mainStyles.wrapper,
          { paddingTop: headerHeight }
        ]} showsVerticalScrollIndicator={false}>

          <View style={[mainStyles.editButtonsList, textFocused > -1 && mainStyles.focusedWrapper]}
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
      </Animated.View>
    </GestureDetector>
  )
}