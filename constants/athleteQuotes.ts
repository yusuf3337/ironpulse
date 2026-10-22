export interface AthleteQuote {
  id: string;
  author: string;
  sport: "Bodybuilding" | "Boxing" | "Martial Arts";
  quoteTr: string;
  quoteEn: string;
}

export const ATHLETE_QUOTES: AthleteQuote[] = [
  {
    id: "tyson-1",
    author: "Mike Tyson",
    sport: "Boxing",
    quoteTr: "Disiplin, nefret ettiğin bir şeyi sanki onu çok seviyormuş gibi yapabilmektir.",
    quoteEn: "Discipline is doing what you hate to do, but doing it like you love it.",
  },
  {
    id: "arnold-1",
    author: "Arnold Schwarzenegger",
    sport: "Bodybuilding",
    quoteTr: "Son üç ya da dört tekrar, kasın büyümesini sağlayan şeydir. Bu acı eşiği bir şampiyonu diğerlerinden ayıran yerdir.",
    quoteEn: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from everyone else.",
  },
  {
    id: "mentzer-1",
    author: "Mike Mentzer",
    sport: "Bodybuilding",
    quoteTr: "Kas büyümesini belirleyen antrenmanın süresi değil, ulaşılan yoğunluktur. Son tekrarın ötesine geçmeden sınırlarını bilemezsin.",
    quoteEn: "It is not the duration of a workout that triggers growth, but the intensity. You cannot know your limits until you push past the final rep.",
  },
  {
    id: "ali-1",
    author: "Muhammad Ali",
    sport: "Boxing",
    quoteTr: "Antrenmanın her dakikasından nefret ettim ama kendime dedim ki: Pes etme. Şimdi acı çek ve hayatının geri kalanını bir şampiyon olarak yaşa.",
    quoteEn: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'",
  },
  {
    id: "bruce-1",
    author: "Bruce Lee",
    sport: "Martial Arts",
    quoteTr: "10.000 farklı tekmeyi bir kez çalışandan korkmam; tek bir tekmeyi 10.000 kez çalışandan korkarım.",
    quoteEn: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
  },
  {
    id: "mentzer-2",
    author: "Mike Mentzer",
    sport: "Bodybuilding",
    quoteTr: "Demir sadece bir araçtır; asıl savaş zihninde ve iradende verilir. Her sette tam odaklanma mutlak kuraldır.",
    quoteEn: "The iron is merely a tool; the real battle is fought in your mind and willpower. Absolute focus on every set is non-negotiable.",
  },
  {
    id: "tyson-2",
    author: "Mike Tyson",
    sport: "Boxing",
    quoteTr: "Herkesin yüzüne sert bir yumruk yiyene kadar bir planı vardır. Gerçek karakter o darbeden sonra nasıl ayağa kalktığındır.",
    quoteEn: "Everyone has a plan until they get hit in the face. Real character is how you stand back up after that impact.",
  },
  {
    id: "arnold-2",
    author: "Arnold Schwarzenegger",
    sport: "Bodybuilding",
    quoteTr: "Güç kazanmaktan gelmez. Senin mücadelelerin güçlerini geliştirir. Zorluklardan geçip pes etmemeye karar verdiğinde, güç işte budur.",
    quoteEn: "Strength does not come from winning. Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength.",
  },
  {
    id: "bruce-2",
    author: "Bruce Lee",
    sport: "Martial Arts",
    quoteTr: "Zihnini boşalt, formsuz ol, şekilsiz ol; tıpkı su gibi. Su bardağa girdiğinde bardak olur. Su ol, dostum.",
    quoteEn: "Empty your mind, be formless, shapeless, like water. When water enters a cup, it becomes the cup. Be water, my friend.",
  },
  {
    id: "yates-1",
    author: "Dorian Yates",
    sport: "Bodybuilding",
    quoteTr: "Salona sadece antrenman yapmaya gelmiyorum; oraya işi bitirmeye ve limitleri parçalamaya geliyorum.",
    quoteEn: "I don't just go to the gym to train; I go there to take care of business and conquer limits.",
  },
  {
    id: "damato-1",
    author: "Cus D'Amato",
    sport: "Boxing",
    quoteTr: "Korku bir ateştir. Onu kontrol etmeyi öğrenirsen seni ısıtır, kontrol edemezsen seni ve her şeyi yakıp yok eder.",
    quoteEn: "Fear is like a fire. If you control it, it can warm you; if you don't, it will consume and destroy you.",
  },
];
