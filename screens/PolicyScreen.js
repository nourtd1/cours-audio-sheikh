import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, ZoomIn, SlideInUp, BounceIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CONTACT_URL = 'mailto:contact@monapp.com'; // À adapter
const PARTICLE_COUNT = 18;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function GoldParticles() {
  // Génère des particules dorées animées
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const left = Math.random() * (SCREEN_WIDTH - 40) + 10;
        const top = Math.random() * 220 + 10;
        const size = Math.random() * 10 + 6;
        const opacity = Math.random() * 0.5 + 0.3;
        const duration = 2000 + Math.random() * 2000;
        return (
          <Animated.View
            key={i}
            entering={FadeIn.duration(1200 + i * 30)}
            style={{
              position: 'absolute',
              left,
              top,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: '#FFD700',
              opacity,
              shadowColor: '#FFD700',
              shadowOpacity: 0.18,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 1 },
              elevation: 2,
            }}
          />
        );
      })}
    </View>
  );
}

export default function PolicyScreen() {
  // Animation de lumière sur le badge
  const [lightPos, setLightPos] = React.useState(0);
  const [btnHover, setBtnHover] = React.useState(false);
  React.useEffect(() => {
    let dir = 1;
    const interval = setInterval(() => {
      setLightPos(pos => {
        if (pos >= 1) dir = -1;
        if (pos <= 0) dir = 1;
        return +(pos + dir * 0.02).toFixed(2);
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#f8fafc"]} start={{x:0.2,y:0}} end={{x:1,y:1}} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={SlideInUp.duration(700)} style={styles.cardWrapper}>
          <LinearGradient
            colors={["#fffbe6", "#fff", "#e0eafc"]}
            start={{x:0, y:0}}
            end={{x:1, y:1}}
            style={styles.card}
          >
            <GoldParticles />
            <View style={styles.iconBadgeWrapper}>
              <LinearGradient
                colors={["#FFD700", "#FFF8DC"]}
                start={{x: lightPos, y:0}}
                end={{x: 1-lightPos, y:1}}
                style={styles.iconBadge}
              >
                <Animated.View entering={ZoomIn.duration(700)} style={styles.iconHalo}>
                  <MaterialCommunityIcons name="shield-lock" size={48} color="#1976d2" style={styles.icon} />
                </Animated.View>
                {/* Effet de lumière */}
                <View style={[styles.lightEffect, { left: 20 + 40*lightPos }]} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>سياسة الخصوصية</Text>
            <View style={styles.separator} />
      <Text style={styles.text}>
              <Text style={styles.boldBlue}>نحن نحترم خصوصيتك</Text> بشكل كامل. هذا التطبيق <Text style={styles.bold}>لا يجمع أو يخزن أي بيانات شخصية</Text> عن المستخدمين. لا يتم تتبع نشاطك أو مشاركة معلوماتك مع أي طرف ثالث.
              {'\n\n'}
              <Text style={styles.boldGreen}>هدفنا</Text> هو تقديم محتوى علمي نافع فقط، دون أي أغراض تجارية أو إعلانية.
              {'\n\n'}
              باستخدامك لهذا التطبيق، فإنك توافق على هذه السياسة البسيطة والواضحة.
              {'\n\n'}
              <Text style={styles.boldGold}>لأي استفسار حول الخصوصية</Text>، لا تتردد في التواصل معنا.
            </Text>
            <Animated.View entering={BounceIn.duration(900)} style={styles.quoteWrapper}>
              <Text style={styles.quoteText}>
                <Text style={styles.quoteMark}>“</Text>
                <Text style={styles.quoteHighlight}>الأمان والخصوصية حق للجميع</Text>
                <Text style={styles.quoteMark}>”</Text>
      </Text>
            </Animated.View>
            <TouchableOpacity
              style={[styles.contactBtn, btnHover && styles.contactBtnHover]}
              onPress={() => Linking.openURL(CONTACT_URL)}
              activeOpacity={0.85}
              onPressIn={() => setBtnHover(true)}
              onPressOut={() => setBtnHover(false)}
            >
              <MaterialCommunityIcons name="email-outline" size={22} color="#fff" style={{marginRight:8}} />
              <Text style={styles.contactBtnText}>تواصل معنا</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 36,
    padding: 38,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    overflow: 'hidden',
  },
  iconBadgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  iconHalo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#e0eafc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1976d2',
    shadowOpacity: 0.20,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  icon: {
    alignSelf: 'center',
  },
  lightEffect: {
    position: 'absolute',
    top: 10,
    width: 28,
    height: 68,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    opacity: 0.7,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Amiri',
    color: '#1976d2',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  separator: {
    width: 80,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginVertical: 18,
    alignSelf: 'center',
    opacity: 0.85,
  },
  text: {
    fontSize: 22,
    fontFamily: 'Amiri',
    color: '#333',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  boldBlue: {
    fontWeight: 'bold',
    color: '#1976d2',
    fontSize: 23,
  },
  boldGreen: {
    fontWeight: 'bold',
    color: '#388e3c',
    fontSize: 22,
  },
  boldGold: {
    fontWeight: 'bold',
    color: '#bfa100',
    fontSize: 22,
  },
  quoteWrapper: {
    marginTop: 22,
    backgroundColor: '#f8fafc',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: '#FFD700',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  quoteText: {
    fontFamily: 'Amiri',
    fontSize: 22,
    color: '#1976d2',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.7,
  },
  quoteMark: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 3,
  },
  quoteHighlight: {
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    paddingHorizontal: 6,
    color: '#bfa100',
    fontWeight: 'bold',
    fontSize: 23,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: 28,
    elevation: 3,
    shadowColor: '#1976d2',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    transitionDuration: '200ms',
  },
  contactBtnHover: {
    backgroundColor: '#388e3c',
    shadowColor: '#388e3c',
    elevation: 6,
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Amiri',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
}); 