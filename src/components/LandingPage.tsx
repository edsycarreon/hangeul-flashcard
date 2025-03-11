import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    title: "Learn at your own pace",
    description: "Whether that's 'speed of light' or 'sloth on vacation'",
    icon: "📚",
  },
  {
    title: "Practice writing naturally",
    description:
      "No more characters that look like they were drawn by a caffeinated squirrel",
    icon: "✏️",
  },
  {
    title: "Remember characters longer",
    description: "Your brain will thank you, even if it complains at first",
    icon: "🧠",
  },
  {
    title: "Track your progress",
    description:
      "Watch yourself transform from 'confused beginner' to 'slightly less confused intermediate'",
    icon: "📈",
  },
];

const steps = [
  {
    number: 1,
    title: "See the character in English",
    description: "The familiar before the storm",
    icon: "🔤",
  },
  {
    number: 2,
    title: "Practice drawing on the canvas",
    description: "Unleash your inner 5-year-old artist",
    icon: "🖌️",
  },
  {
    number: 3,
    title: "Check your work against the Korean character",
    description: "Prepare for a reality check",
    icon: "👀",
  },
  {
    number: 4,
    title: "Rate your performance",
    description: "Be honest – your phone can't judge you... yet",
    icon: "⭐",
  },
  {
    number: 5,
    title: "Review based on your ratings",
    description: "We'll remind you of the ones you messed up, because we care",
    icon: "🔄",
  },
];

const characterSets = [
  {
    title: "Consonants",
    description:
      "The building blocks of Hangul (not to be confused with building blocks you step on barefoot)",
    sample: "ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ",
  },
  {
    title: "Vowels",
    description:
      "The glue that holds it all together (unlike that DIY project in your garage)",
    sample: "ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ",
  },
  {
    title: "Syllables",
    description:
      "Where the magic happens (and where beginners occasionally cry)",
    sample: "가 나 다 라 마 바 사",
  },
];

const faqs = [
  {
    question: "Do I need any prior knowledge of Korean?",
    answer:
      "Only the knowledge that it's not the same as Chinese or Japanese. That's a start!",
  },
  {
    question: "How long will it take to learn all characters?",
    answer:
      "Somewhere between 'a dedicated weekend' and 'less time than it takes to finish that TV series you've been binging'",
  },
  {
    question: "Can I use this on my mobile device?",
    answer:
      "Yes! Practice anywhere – impress strangers on the bus with your newfound skills!",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Nope! No account, no password to forget, no existential dread about another digital footprint",
  },
  {
    question: "Is there a pronunciation guide?",
    answer:
      "We help with writing, not speaking. For pronunciation, you're still on your own – so maybe don't try ordering in Korean just yet",
  },
];

export const LandingPage = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isAnimating] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const navigate = useNavigate();

  const goToApp = () => {
    navigate("/app");
  };

  // Cycle through cards for the demo effect
  useEffect(() => {
    // Only cycle cards when not flipped
    if (!isFlipped) {
      const interval = setInterval(() => {
        setActiveCard((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isFlipped]);

  // Simulate a flashcard for the demo
  const flashcardDemo = [
    { english: "Water", korean: "물" },
    { english: "Hello", korean: "안녕" },
    { english: "Thank you", korean: "감사" },
  ];

  // Function to flip the card
  const flipCard = () => {
    setIsFlipped(!isFlipped);

    // If flipping back to front, move to the next card
    if (isFlipped) {
      setActiveCard((prev) => (prev + 1) % 3);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Master Korean Characters{" "}
                <span className="text-blue-600">
                  Before Your Favorite Korean Drama Ends
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Learn Hangul with our flashcard system – like regular flashcards
                but without paper cuts.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
                  onClick={goToApp}
                >
                  Start Learning Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={() => {
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </div>

            <div className="w-full md:w-1/2">
              <motion.div
                className="relative h-80 w-full max-w-md mx-auto perspective-1000"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div
                  className={`relative w-full h-full rounded-2xl shadow-2xl transition-all duration-500 transform ${
                    isAnimating ? "animate-float" : ""
                  } cursor-pointer hover:shadow-blue-200 hover:shadow-xl`}
                  onClick={flipCard}
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s",
                  }}
                >
                  {/* Interactive hint */}
                  <div
                    className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-blue-600 bg-white px-2 py-1 rounded-full shadow-sm border border-blue-100 ${
                      !isFlipped ? "animate-pulse-custom" : ""
                    }`}
                  >
                    <span className="inline-block mr-1">👆</span>{" "}
                    {isFlipped ? "Click to flip back" : "Click to flip"}
                  </div>
                  <div
                    className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden backface-hidden"
                    style={{
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                      opacity: isFlipped ? 0 : 1,
                      transition: "opacity 0.3s, transform 0s 0.3s",
                    }}
                  >
                    <div className="h-full flex flex-col p-6">
                      <div className="flex justify-between items-center mb-8">
                        <div className="text-lg font-semibold text-gray-500">
                          English
                        </div>
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-5xl font-bold text-center">
                          {flashcardDemo[activeCard].english}
                        </div>
                      </div>
                      <div className="flex justify-center mt-8">
                        <div className="px-6 py-3 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          Flip to see Korean →
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden backface-hidden"
                    style={{
                      transform: isFlipped
                        ? "rotateY(0deg)"
                        : "rotateY(-180deg)",
                      opacity: isFlipped ? 1 : 0,
                      transition: "opacity 0.3s, transform 0s 0.3s",
                    }}
                  >
                    <div className="h-full flex flex-col p-6">
                      <div className="flex justify-between items-center mb-8">
                        <div className="text-lg font-semibold text-gray-500">
                          Korean
                        </div>
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-8xl font-bold text-center">
                          {flashcardDemo[activeCard].korean}
                        </div>
                      </div>
                      <div className="flex justify-center mt-8">
                        <div className="text-base text-gray-500">
                          {flashcardDemo[activeCard].english}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Learn With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a K-pop enthusiast, drama addict, or just curious
              about Korean culture, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-blue-50 px-4 py-2 rounded-full text-blue-600 font-medium">
              Join 10,000+ learners who are no longer intimidated by Korean
              texts
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features That Make Learning Fun
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed our app to make learning Korean characters as
              painless as possible (which is still a bit painful, but hey,
              that's language learning).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              className="rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-6 md:p-8">
                <div className="border border-gray-200 rounded-lg p-4 aspect-square flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="text-8xl mb-6">안</div>
                    <div className="text-gray-800 font-medium">
                      Draw this character
                    </div>

                    <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg w-full max-w-xs aspect-square flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Drawing canvas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Interactive Drawing Canvas
                </h3>
                <p className="text-gray-600">
                  Practice writing Korean characters with our responsive drawing
                  canvas. It's like having a digital pen pal who happens to be
                  really into Korean.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Flip-Card Learning System
                </h3>
                <p className="text-gray-600">
                  Our intuitive flashcard system shows you the English meaning
                  first, then challenges you to recall and write the Korean
                  character.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Spaced Repetition
                </h3>
                <p className="text-gray-600">
                  Characters you struggle with will appear more frequently,
                  while those you've mastered will show up less often – it's
                  like the app is reading your mind, but less creepy.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learning Korean characters is a journey. Here's your roadmap to
              success (or at least to impressing your friends).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-blue-200 -z-10 transform -translate-x-1/2"></div>
                )}

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Character Set Overview */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic strokes to complete syllables, we've got all the Korean
              characters you need to start reading and writing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {characterSets.map((set, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {set.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{set.description}</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-3xl text-center font-medium text-gray-800 tracking-wide">
                      {set.sample}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-700 mb-2">
              From total beginner to reading K-pop lyrics
            </p>
            <div className="h-2 bg-gray-200 rounded-full max-w-3xl mx-auto">
              <div className="h-2 bg-blue-500 rounded-full w-1/3"></div>
            </div>
            <div className="flex justify-between max-w-3xl mx-auto mt-2 text-sm text-gray-600">
              <span>Day 1: "What are these symbols?"</span>
              <span>Someday: "K-drama without subtitles"</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you wanted to know but were afraid to ask (we don't
              judge).
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  className={`w-full text-left p-4 md:p-6 rounded-lg flex justify-between items-center ${
                    openFaq === index ? "bg-blue-50" : "bg-gray-50"
                  }`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-lg text-gray-900">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openFaq === index && (
                  <div className="bg-white p-4 md:p-6 rounded-b-lg border-t border-gray-100">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Master Korean Characters?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              No account required, no credit card, no firstborn child – just
              pure learning.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
              onClick={goToApp}
            >
              Start Learning Now
            </Button>
            <p className="mt-6 text-blue-200">
              Your journey to reading Korean starts with a single click.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Korean Flashcards</h3>
              <p className="text-gray-400">
                A tool for learning to write Korean Hangul characters through
                practice and spaced repetition.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToApp();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">
                Questions or feedback? We'd love to hear from you!
              </p>
              <a
                href="mailto:contact@koreanflashcards.app"
                className="text-blue-300 hover:text-blue-200 transition-colors"
              >
                edsonjaybcarreon@gmail.com
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Korean Character Flashcard App. All
              rights reserved.
            </p>
            <p className="mt-2">Built with caffeine and code.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
