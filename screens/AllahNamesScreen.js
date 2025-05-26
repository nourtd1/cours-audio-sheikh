import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const names = [
  { arabic: 'ٱلرَّحْمَٰنُ', translit: 'Ar-Rahmān', english: 'The Most Merciful' },
  { arabic: 'ٱلرَّحِيمُ', translit: 'Ar-Rahīm', english: 'The Most Compassionate' },
  { arabic: 'ٱلْمَلِكُ', translit: 'Al-Malik', english: 'The King and Owner of Dominion' },
  { arabic: 'ٱلْقُدُّوسُ', translit: 'Al-Quddūs', english: 'The Absolutely Pure' },
  { arabic: 'ٱلسَّلَامُ', translit: 'As-Salām', english: 'The Source of Peace, Safety' },
  { arabic: 'ٱلْمُؤْمِنُ', translit: "Al-Mu'min", english: 'The One Who gives Emaan and Security' },
  { arabic: 'ٱلْمُهَيْمِنُ', translit: 'Al-Muhaymin', english: 'The Guardian, The Witness, The Overseer' },
  { arabic: 'ٱلْعَزِيزُ', translit: "Al-'Azīz", english: 'The Almighty' },
  { arabic: 'ٱلْجَبَّارُ', translit: 'Al-Jabbār', english: 'The Compeller, The Restorer' },
  { arabic: 'ٱلْمُتَكَبِّرُ', translit: 'Al-Mutakabbir', english: 'The Supreme, The Majestic' },
  { arabic: 'ٱلْخَالِقُ', translit: 'Al-Khāliq', english: 'The Creator, The Maker' },
  { arabic: 'ٱلْبَارِئُ', translit: "Al-Bāriʾ", english: 'The Evolver' },
  { arabic: 'ٱلْمُصَوِّرُ', translit: 'Al-Muṣawwir', english: 'The Fashioner' },
  { arabic: 'ٱلْغَفَّارُ', translit: 'Al-Ghaffār', english: 'The Constant Forgiver' },
  { arabic: 'ٱلْقَهَّارُ', translit: 'Al-Qahhār', english: 'The All-Subduer' },
  { arabic: 'ٱلْوَهَّابُ', translit: 'Al-Wahhāb', english: 'The Supreme Bestower' },
  { arabic: 'ٱلرَّزَّاقُ', translit: 'Ar-Razzāq', english: 'The Provider' },
  { arabic: 'ٱلْفَتَّاحُ', translit: 'Al-Fattāḥ', english: 'The Supreme Opener' },
  { arabic: 'ٱلْعَلِيمُ', translit: "Al-'Alīm", english: 'The All-Knowing' },
  { arabic: 'ٱلْقَابِضُ', translit: 'Al-Qābiḍ', english: 'The Withholder' },
  { arabic: 'ٱلْبَاسِطُ', translit: 'Al-Bāsiṭ', english: 'The Extender' },
  { arabic: 'ٱلْخَافِضُ', translit: 'Al-Khāfiḍ', english: 'The Reducer' },
  { arabic: 'ٱلرَّافِعُ', translit: "Ar-Rāfiʿ", english: 'The Exalter' },
  { arabic: 'ٱلْمُعِزُّ', translit: "Al-Mu'izz", english: 'The Honourer, the Bestower' },
  { arabic: 'ٱلْمُذِلُّ', translit: 'Al-Mudhill', english: 'The Dishonourer' },
  { arabic: 'ٱلسَّمِيعُ', translit: "As-Samīʿ", english: 'The All-Hearing' },
  { arabic: 'ٱلْبَصِيرُ', translit: 'Al-Baṣīr', english: 'The All-Seeing' },
  { arabic: 'ٱلْحَكَمُ', translit: 'Al-Ḥakam', english: 'The Impartial Judge' },
  { arabic: 'ٱلْعَدْلُ', translit: "Al-'Adl", english: 'The Utterly Just' },
  { arabic: 'ٱللَّطِيفُ', translit: 'Al-Laṭīf', english: 'The Subtle One, The Most Gentle' },
  { arabic: 'ٱلْخَبِيرُ', translit: 'Al-Khabīr', english: 'The All-Aware' },
  { arabic: 'ٱلْحَلِيمُ', translit: 'Al-Ḥalīm', english: 'The Most Forbearing' },
  { arabic: 'ٱلْعَظِيمُ', translit: "Al-'Aẓīm", english: 'The Magnificent, the Infinite' },
  { arabic: 'ٱلْغَفُورُ', translit: 'Al-Ghafūr', english: 'The Great Forgiver' },
  { arabic: 'ٱلشَّكُورُ', translit: 'Ash-Shakūr', english: 'The Most Appreciative' },
  { arabic: 'ٱلْعَلِيُّ', translit: "Al-'Aliyy", english: 'The Most High, the Exalted' },
  { arabic: 'ٱلْكَبِيرُ', translit: 'Al-Kabīr', english: 'The Most Great' },
  { arabic: 'ٱلْحَفِيظُ', translit: 'Al-Ḥafīẓ', english: 'The Preserver' },
  { arabic: 'ٱلْمُقِيتُ', translit: 'Al-Muqīt', english: 'The Sustainer' },
  { arabic: 'ٱلْحسِيبُ', translit: 'Al-Ḥasīb', english: 'The Reckoner' },
  { arabic: 'ٱلْجَلِيلُ', translit: 'Al-Jalīl', english: 'The Majestic' },
  { arabic: 'ٱلْكَرِيمُ', translit: 'Al-Karīm', english: 'The Most Generous, the Most Esteemed' },
  { arabic: 'ٱلرَّقِيبُ', translit: 'Ar-Raqīb', english: 'The Watchful' },
  { arabic: 'ٱلْمُجِيبُ', translit: 'Al-Mujīb', english: 'The Responsive One' },
  { arabic: 'ٱلْوَاسِعُ', translit: "Al-Wāsiʿ", english: 'The All-Encompassing, the Boundless' },
  { arabic: 'ٱلْحَكِيمُ', translit: 'Al-Ḥakīm', english: 'The All-Wise' },
  { arabic: 'ٱلْوَدُودُ', translit: 'Al-Wadūd', english: 'The Most Loving' },
  { arabic: 'ٱلْمَجِيدُ', translit: 'Al-Majīd', english: 'The Glorious, the Most Honorable' },
  { arabic: 'ٱلْبَاعِثُ', translit: "Al-Bāʿith", english: 'The Infuser of New Life' },
  { arabic: 'ٱلشَّهِيدُ', translit: 'Ash-Shahīd', english: 'The All-and-Ever Witnessing' },
  { arabic: 'ٱلْحَقُ', translit: 'Al-Ḥaqq', english: 'The Absolute Truth' },
  { arabic: 'ٱلْوَكِيلُ', translit: 'Al-Wakīl', english: 'The Trustee, the Disposer of Affairs' },
  { arabic: 'ٱلْقَوِيُ', translit: 'Al-Qawiyy', english: 'The All-Strong' },
  { arabic: 'ٱلْمَتِينُ', translit: 'Al-Matīn', english: 'The Firm One' },
  { arabic: 'ٱلْوَلِيُّ', translit: 'Al-Waliyy', english: 'The Sole Provider' },
  { arabic: 'ٱلْحَمِيدُ', translit: 'Al-Ḥamīd', english: 'The Praiseworthy' },
  { arabic: 'ٱلْمُحْصِي', translit: 'Al-Muḥṣī', english: 'The All-Enumerating, the Counter' },
  { arabic: 'ٱلْمُبْدِئُ', translit: "Al-Mubdiʾ", english: 'The Originator, the Initiator' },
  { arabic: 'ٱلْمُعِيدُ', translit: "Al-Muʿīd", english: 'The Restorer, the Reinstater' },
  { arabic: 'ٱلْمُحْيِي', translit: 'Al-Muḥyī', english: 'The Giver of Life' },
  { arabic: 'ٱلْمُمِيتُ', translit: 'Al-Mumīt', english: 'The Creator of Death' },
  { arabic: 'ٱلْحَيُّ', translit: 'Al-Ḥayy', english: 'The Ever-Living' },
  { arabic: 'ٱلْقَيُّومُ', translit: 'Al-Qayyūm', english: 'The Sustainer, The Self-Subsisting' },
  { arabic: 'ٱلْوَاجِدُ', translit: 'Al-Wājid', english: 'The Perceiver' },
  { arabic: 'ٱلْمَاجِدُ', translit: 'Al-Mājid', english: 'The Glorious, the Most Honorable' },
  { arabic: 'ٱلْواحِدُ', translit: 'Al-Wāḥid', english: 'The Only One' },
  { arabic: 'ٱلْأَحَدُ', translit: 'Al-Aḥad', english: 'The Indivisible, the Absolute' },
  { arabic: 'ٱلصَّمَدُ', translit: 'Aṣ-Ṣamad', english: 'The Self-Sufficient, the Impregnable' },
  { arabic: 'ٱلْقَادِرُ', translit: 'Al-Qādir', english: 'The Omnipotent' },
  { arabic: 'ٱلْمُقْتَدِرُ', translit: 'Al-Muqtadir', english: 'The Creator of All Power' },
  { arabic: 'ٱلْمُقَدِّمُ', translit: 'Al-Muqaddim', english: 'The Expediter' },
  { arabic: 'ٱلْمُؤَخِّرُ', translit: "Al-Mu'akhkhir", english: 'The Delayer' },
  { arabic: 'ٱلأوَّلُ', translit: 'Al-Awwal', english: 'The First' },
  { arabic: 'ٱلْآخِرُ', translit: 'Al-Ākhir', english: 'The Last' },
  { arabic: 'ٱلظَّاهِرُ', translit: 'Aẓ-Ẓāhir', english: 'The Manifest' },
  { arabic: 'ٱلْبَاطِنُ', translit: 'Al-Bāṭin', english: 'The Hidden One, Knower of the Hidden' },
  { arabic: 'ٱلْوَالِي', translit: 'Al-Wālī', english: 'The Sole Governor' },
  { arabic: 'ٱلْمُتَعَالِي', translit: "Al-Mutaʿālī", english: 'The Self Exalted' },
  { arabic: 'ٱلْبَرُّ', translit: 'Al-Barr', english: 'The Source of All Goodness' },
  { arabic: 'ٱلتَّوَابُ', translit: 'At-Tawwāb', english: 'The Ever-Accepter of Repentance' },
  { arabic: 'ٱلْمُنْتَقِمُ', translit: 'Al-Muntaqim', english: 'The Avenger' },
  { arabic: 'ٱلْعَفُوُ', translit: "Al-'Afūw", english: 'The Supreme Pardoner' },
  { arabic: 'ٱلرَّؤُوفُ', translit: "Ar-Ra'ūf", english: 'The Most Kind' },
  { arabic: 'مَالِكُ ٱلْمُلْكِ', translit: 'Mālik-ul-Mulk', english: 'Master and King of the Kingdom' },
  { arabic: 'ذُوالْجَلَالِ وَٱلْإِكْرَامِ', translit: 'Dhū-al-Jalāli Wal-Ikrām', english: 'Lord of Glory and Honour, Lord of Majesty and Generosity' },
  { arabic: 'ٱلْمُقْسِطُ', translit: 'Al-Muqsiṭ', english: 'The Just One' },
  { arabic: 'ٱلْجَامِعُ', translit: "Al-Jāmiʿ", english: 'The Gatherer, the Uniter' },
  { arabic: 'ٱلْغَنِيُّ', translit: 'Al-Ghaniyy', english: 'The Self-Sufficient, the Wealthy' },
  { arabic: 'ٱلْمُغْنِي', translit: 'Al-Mughnī', english: 'The Enricher' },
  { arabic: 'ٱلْمَانِعُ', translit: "Al-Māniʿ", english: 'The Withholder' },
  { arabic: 'ٱلضَّارَ', translit: 'Aḍ-Ḍārr', english: 'Distresser' },
  { arabic: 'ٱلنَّافِعُ', translit: "An-Nāfiʿ", english: 'The Propitious, the Benefactor' },
  { arabic: 'ٱلنُّورُ', translit: 'An-Nūr', english: 'The Light, the Illuminator' },
  { arabic: 'ٱلْهَادِي', translit: 'Al-Hādī', english: 'The Guide' },
  { arabic: 'ٱلْبَدِيعُ', translit: "Al-Badīʿ", english: 'Incomparable Originator' },
  { arabic: 'ٱلْبَاقِي', translit: 'Al-Bāqī', english: 'The Everlasting' },
  { arabic: 'ٱلْوَارِثُ', translit: 'Al-Wārith', english: 'The Inheritor, the Heir' },
  { arabic: 'ٱلرَّشِيدُ', translit: 'Ar-Rashīd', english: 'The Guide, Infallible Teacher, and Knower' },
  { arabic: 'ٱلصَّبُورُ', translit: 'Aṣ-Ṣabūr', english: 'The Most Patient' },
];

function handleShare(item) {
  Share.share({
    message: `${item.arabic}\n${item.translit}\n${item.english}`,
  });
}

function AnimatedCard({ item, index }) {
  const scale = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      delay: index * 30,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.card, { opacity: fade, transform: [{ scale }] }]}> 
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{ flex: 1 }}
      >
        <View style={styles.row}>
          <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare(item)}>
            <MaterialCommunityIcons name="share-variant" size={22} color="#888" />
          </TouchableOpacity>
          <Text style={styles.arabic}>{item.arabic}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{index + 1}</Text></View>
        </View>
        <View style={styles.transBlock}>
          <Text style={styles.translit}>{item.translit}</Text>
          <Text style={styles.english}>{item.english}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function AllahNamesScreen() {
  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#f8fafc"]} start={{x:0.2,y:0}} end={{x:1,y:1}} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>أسماء الله الحسنى</Text>
        <FlatList
          data={names}
          keyExtractor={item => item.arabic}
          renderItem={({ item, index }) => (
            <AnimatedCard item={item} index={index} />
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 12 },
  title: { fontSize: 26, fontFamily: 'Amiri', color: '#222', marginBottom: 18, textAlign: 'center', letterSpacing: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  shareBtn: { padding: 4 },
  arabic: { fontSize: 28, color: '#1976d2', fontFamily: 'Amiri', textAlign: 'right', flex: 1 },
  badge: { backgroundColor: '#a11d2a', borderRadius: 16, width: 32, height: 32, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Amiri' },
  transBlock: { marginTop: 4 },
  translit: { fontSize: 18, color: '#444', fontFamily: 'Amiri', textAlign: 'left' },
  english: { fontSize: 16, color: '#a11d2a', fontFamily: 'Amiri', textAlign: 'left', marginTop: 2 },
}); 