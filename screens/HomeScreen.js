import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, I18nManager, Linking, Modal, Pressable, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const buttons = [
  {
    icon: require('../assets/music-placeholder.png'),
    label: 'محاضرات',
    sub: 'بدون نت',
    onPress: (nav) => nav.navigate('AudioList'),
  },
  {
    icon: require('../assets/favorite-placeholder.png'),
    label: 'مفضلة',
    sub: 'مشغل السريع',
    onPress: (nav) => nav.navigate('Favorites'),
  },
  {
    icon: require('../assets/star-placeholder.png'),
    label: 'قيم تطبيقنا',
    sub: 'قيم تطبيقنا',
    onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=ton.package'),
  },
  {
    icon: require('../assets/web-placeholder.png'),
    label: 'موقعنا',
    sub: 'القرآن الكريم',
    onPress: (nav) => nav.navigate('WebView'),
  },
  {
    icon: require('../assets/flag-placeholder.png'),
    label: 'سياسة',
    sub: 'التطبيق',
    onPress: (nav) => nav.navigate('Policy'),
  },
  {
    icon: require('../assets/beads-placeholder.png'),
    label: 'عدد',
    sub: 'التسبيحات',
    onPress: (nav) => nav.navigate('Tasbih'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [notifMenuVisible, setNotifMenuVisible] = React.useState(false);

  // Fonctions fictives pour les actions de notification
  const sendTestNotification = () => {
    setNotifMenuVisible(false);
    // Ajoute ici la logique réelle si besoin
    alert('Notification de test envoyée !');
  };
  const activateDailyReminder = () => {
    setNotifMenuVisible(false);
    // Ajoute ici la logique réelle si besoin
    alert('Rappel quotidien activé à 20h !');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Découvre cette super application ! https://play.google.com/store/apps/details?id=ton.package"
      });
    } catch (error) {
      alert('Erreur lors du partage');
    }
  };

  const handleInfo = () => {
    navigation.navigate('Policy');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background-placeholder.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.topIconBtn} onPress={() => setNotifMenuVisible(true)}>
            <MaterialCommunityIcons name="bell-outline" size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.topRightRow}>
            <TouchableOpacity style={styles.topIconBtn} onPress={handleShare}>
              <Image source={require('../assets/share-placeholder.png')} style={styles.topIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topIconBtn} onPress={handleInfo}>
              <Image source={require('../assets/info-placeholder.png')} style={styles.topIcon} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Modal pour le menu notifications */}
        <Modal
          visible={notifMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setNotifMenuVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setNotifMenuVisible(false)}>
            <View style={styles.notifMenu}>
              <TouchableOpacity style={styles.notifMenuBtn} onPress={sendTestNotification}>
                <MaterialCommunityIcons name="bell-ring-outline" size={22} color="#1976d2" />
                <Text style={styles.notifMenuText}>Envoyer une notification de test</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notifMenuBtn} onPress={activateDailyReminder}>
                <MaterialCommunityIcons name="clock-outline" size={22} color="#1976d2" />
                <Text style={styles.notifMenuText}>Activer le rappel quotidien à 20h</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
        {/* Central avatar */}
        <View style={styles.centerAvatarWrapper}>
          <Image source={require('../assets/avatar-frame-placeholder.png')} style={styles.avatarFrame} />
          <Image source={require('../assets/sheikh-placeholder.png')} style={styles.avatar} />
        </View>
        {/* Grid buttons */}
        <View style={styles.gridWrapper}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity key={idx} style={styles.gridBtn} onPress={() => btn.onPress(navigation)}>
              <Image source={btn.icon} style={styles.gridIcon} />
              <Text style={styles.gridLabel}>{btn.label}</Text>
              <Text style={styles.gridSub}>{btn.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Big button */}
        <TouchableOpacity style={styles.bigBtn} onPress={() => navigation.navigate('AllahNames')}>
          <Image source={require('../assets/allah-placeholder.png')} style={styles.bigBtnIcon} />
          <Text style={styles.bigBtnText}>أسماء الله الحسنى</Text>
        </TouchableOpacity>
        {/* Banner ad */}
        <View style={styles.bannerAd}>
          <Text style={styles.bannerText}>مساحة الوحدة الإعلانية المحجوزة</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 36,
    left: 24,
    right: 24,
    zIndex: 2,
  },
  topIconBtn: {
    marginLeft: 12,
    marginRight: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    elevation: 2,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIcon: {
    width: 28,
    height: 28,
  },
  centerAvatarWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  avatarFrame: {
    position: 'absolute',
    width: 140,
    height: 140,
    zIndex: 1,
    top: -10,
    left: -10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#fff',
    zIndex: 2,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 16,
    width: '95%',
  },
  gridBtn: {
    width: '30%',
    margin: '1.5%',
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 16,
    elevation: 2,
  },
  gridIcon: {
    width: 38,
    height: 38,
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 18,
    color: '#222',
    fontFamily: 'Amiri',
    textAlign: 'center',
  },
  gridSub: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Amiri',
    textAlign: 'center',
    marginTop: 2,
  },
  bigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 2,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  bigBtnIcon: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  bigBtnText: {
    fontSize: 20,
    color: '#222',
    fontFamily: 'Amiri',
    textAlign: 'center',
  },
  bannerAd: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 4,
  },
  bannerText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Amiri',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  notifMenu: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 60,
    marginRight: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 6,
    minWidth: 220,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  notifMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  notifMenuText: {
    fontSize: 15,
    color: '#222',
    marginLeft: 10,
    fontFamily: 'Amiri',
  },
}); 