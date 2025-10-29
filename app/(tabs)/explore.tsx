import { useRouter } from "expo-router";
<<<<<<< HEAD
import React from "react";
import {
  Alert // Alert 추가: 존재하지 않는 기능에 대한 사용자 피드백
  ,
=======
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
<<<<<<< HEAD
  View
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 시간표 데이터 타입
interface TimetableItem {
  id: string;
  title: string;
  time: string;
}

// 기타 수업 데이터 타입
interface OtherClassItem {
  id: string;
  title: string;
  type: string;
}

// 시간표 및 기타 수업 데이터를 위한 더미 데이터
const timetableData: TimetableItem[] = [
  { id: "1", title: "운영체제", time: "월 10:00 - 12:00" },
  { id: "2", title: "컴퓨터네트워크", time: "화 14:00 - 16:00" },
];

const otherClassesData: OtherClassItem[] = [
  { id: "1", title: "글쓰기", type: "온라인 강의" },
  { id: "2", title: "영어 특강", type: "온라인 강의" },
];

// 주요 기능 아이콘 매핑
=======
  View,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//⚠️ Firebase/Auth/DB 관련 기능 및 데이터베이스 연결 임포트
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
// '../../firebaseConfig'는 상대 경로에 따라 적절히 조정되어야 합니다.
// 여기서는 임시로 '../../firebaseConfig'가 존재하는 것으로 가정합니다.
import { db } from '../../firebaseConfig';


interface TimetableEntry {
  id: string;
  courseName: string;
  professor: string;
  location: string;
  time: string;
  userId: string;
  isOnline: boolean;
}

const parseTime = (timeString: string) => {
  if (timeString === '온라인 강의') return null;

  const parts = timeString.split(' ');
  if (parts.length < 2) {
    return null;
  }

  const [day, timeRange] = parts;
  const [startTimeStr, endTimeStr] = timeRange.split('-');

  const parseHourMinute = (hmStr: string) => {
    const [h, m] = hmStr.split(':').map(Number);
    return h + m / 60;
  };

  try {
    const start = parseHourMinute(startTimeStr);
    const end = parseHourMinute(endTimeStr);
    return { day, start, end };
  } catch (e) {
    return null;
  }
};

{/*오늘 요일을 한국어 (월, 화, 수, ...)로 반환하는 함수*/}
const getTodayKoreanDay = () => {
    const date = new Date();
    const dayIndex = date.getDay();
    const koreanDays = ['일', '월', '화', '수', '목', '금', '토'];
    return koreanDays[dayIndex];
};


>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
const featureIcons: Record<string, string> = {
  "중고 마켓": "🛍️",
  "셔틀버스": "🚌",
  "택시 파티": "🚕",
  "동아리 모집": "👥",
  "분실물 센터": "🔍",
};

const ExploreScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

<<<<<<< HEAD
  // ⚠️ 기능 카드 클릭 핸들러: 택시 파티 기능 추가
  const handleFeaturePress = (featureName: string) => {
    switch (featureName) {
      case "택시 파티":
        // 새로운 taxiparty.tsx 경로로 이동
        router.push('/(tabs)/taxiparty');
        break;
      case "중고 마켓":
      case "셔틀버스":
      case "동아리 모집":
      case "분실물 센터":
      default:
        // 나머지 미구현 기능에 대한 알림
        Alert.alert("준비 중", `${featureName} 기능은 현재 개발 중입니다. 잠시만 기다려 주세요!`);
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 View에 Safe Area 패딩을 적용하여 노치 영역 피하기 */}
=======
  {/*⚠️ 상태 관리 추가*/}
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(getAuth().currentUser);

  const today = getTodayKoreanDay(); {/*오늘 요일 (예: '수')*/}

  const fetchTimetable = async (uid: string) => {
    setLoading(true);
    try {
      const timetableCollection = collection(db, 'timetables');
      const userQuery = query(timetableCollection, where("userId", "==", uid));
      const timetableSnapshot = await getDocs(userQuery);
      const timetableList = timetableSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as TimetableEntry[];
      setTimetable(timetableList);
    } catch (error) {
      console.error("시간표 데이터를 불러오는 중 오류 발생: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        fetchTimetable(currentUser.uid);
      } else {
        setTimetable([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);


  {/*⚠️ 데이터 필터링 (오늘의 정규 수업 및 온라인 수업)*/}
  const todayTimetable = timetable
    .filter(item => !item.isOnline)
    .filter(item => {
      const parsed = parseTime(item.time);
      return parsed && parsed.day === today;
    })
    .sort((a, b) => {
        const timeA = parseTime(a.time);
        const timeB = parseTime(b.time);
        return (timeA?.start || 0) - (timeB?.start || 0);
    });

  const onlineClasses = timetable.filter(item => item.isOnline);

  {/*로딩 중일 때*/}
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff8a3d" />
        <Text style={styles.loadingText}>시간표를 불러오는 중...</Text>
      </View>
    );
  }
  
  {/*로그인하지 않았을 때*/}
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로그인이 필요합니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
      <View style={{ paddingTop: insets.top, backgroundColor: '#fff' }} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}>
        
<<<<<<< HEAD
        {/* 내 시간표 카드 */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>내 시간표</Text>
            {timetableData.map((item) => (
              <View key={item.id} style={styles.timetableItem}>
                <Text style={styles.timetableText}>{item.title}</Text>
                <Text style={styles.timetableSubText}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 기타 수업 목록 카드 */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>기타 수업 목록</Text>
            {otherClassesData.map((item) => (
              <View key={item.id} style={styles.otherClassItem}>
                <Text style={styles.icon}>💻</Text>
                <Text style={styles.otherClassText}>
                  {item.title} ({item.type})
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 주요 기능 그리드 */}
        <View style={styles.featuresGrid}>
          {Object.entries(featureIcons).map(([feature, icon]) => (
            // ⚠️ onPress 이벤트 핸들러 추가
            <TouchableOpacity 
              key={feature} 
              style={styles.featureCard}
              onPress={() => handleFeaturePress(feature)} 
            >
=======
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>오늘의 시간표 ({today}요일)</Text>
            {todayTimetable.length > 0 ? (
              todayTimetable.map((item) => (
                <View key={item.id} style={styles.timetableItem}>
                  <Text style={styles.timetableText}>{item.courseName}</Text>
                  <Text style={styles.timetableSubText}>{item.time.replace(`${today} `, '')} / {item.location}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>오늘 ({today}요일) 수업이 없습니다.</Text>
            )}
          </View>
        </View>

        
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>온라인 강의 목록</Text>
            {onlineClasses.length > 0 ? (
              onlineClasses.map((item) => (
                <View key={item.id} style={styles.otherClassItem}>
                  <Text style={styles.icon}>💻</Text>
                  <Text style={styles.otherClassText}>
                    {item.courseName} ({item.time})
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>등록된 온라인 강의가 없습니다.</Text>
            )}
          </View>
        </View>

        
        <View style={styles.featuresGrid}>
        {Object.entries(featureIcons).map(([feature, icon]) => (
            <TouchableOpacity key={feature} style={styles.featureCard}>
>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
              <View style={styles.featureCardContent}>
                <Text style={styles.featureIcon}>{icon}</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

<<<<<<< HEAD
        {/* 정보 카드 */}
        <View style={styles.infoCard}>
          <View style={styles.cardContent}>
            <Text style={styles.infoTitle}>KDUKIT에 오신 것을 환영합니다!</Text>
            <Text style={styles.infoText}>
              KDUKIT은 우리 학교 재학생만을 위한 통합 플랫폼입니다. 신뢰성
              높은 커뮤니티에서 더 편리한 대학 생활을 시작하세요.
=======
        
        <View style={styles.infoCard}>
          <View style={styles.cardContent}>
            <Text style={styles.infoTitle}>KDUKIT에 오신 것을 환영합니다!</Text>
            {/* ✅ FIX: Changed to use a template literal to prevent parsing errors with multiline strings */}
            <Text style={styles.infoText}>
              {`KDUKIT은 우리 학교 재학생만을 위한 통합 플랫폼입니다. 신뢰성높은 커뮤니티에서 더 편리한 대학 생활을 시작하세요.`}
>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
            </Text>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.infoButtonText}>자세히 알아보기</Text>
            </TouchableOpacity>
          </View>
        </View>
<<<<<<< HEAD
=======

>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
<<<<<<< HEAD
  // ⚠️ scrollContent에서 상단 패딩 제거 (인셋이 처리)
  scrollContent: {
    padding: 16,
  },
  // ⚠️ 로그아웃 버튼 관련 스타일 제거
=======
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    padding: 16,
  },
>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  timetableItem: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#e8f0fe",
    borderRadius: 8,
  },
  timetableText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  timetableSubText: {
    fontSize: 13,
    color: "#666",
  },
<<<<<<< HEAD
=======
  noDataText: {
    fontSize: 15,
    color: "#999",
    textAlign: 'center',
    paddingVertical: 10,
  },
>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
  otherClassItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#fffbe5",
    borderRadius: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  otherClassText: {
<<<<<<< HEAD
=======
    flex: 1,
>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
    fontSize: 15,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  featureCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureCardContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  featureIcon: {
    fontSize: 40,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0062ffff",
    textAlign: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  infoButton: {
    width: "60%",
    alignSelf: "center",
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#0062ffff",
  },
  infoButtonText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> b706830f072d9d87133b11f83b988f80e293dd87
