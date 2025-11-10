import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { OurMission } from "./components/OurMission";
import { ImpactStats } from "./components/ImpactStats";
import { Testimonials } from "./components/Testimonials";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { OnboardingForm } from "./components/OnboardingForm";
import { SignUpForm } from "./components/SignUpForm";
import { SignInForm } from "./components/SignInForm";
import { ResultsSummary } from "./components/ResultsSummary";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Dashboard } from "./components/Dashboard";
import { AnimatePresence } from "motion/react";

interface UserData {
  name: string;
  email: string;
}

export default function App() {
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showResultsSummary, setShowResultsSummary] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [onboardingFormData, setOnboardingFormData] = useState<any>(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [pendingDashboardAccess, setPendingDashboardAccess] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ecolifeUser");
    const seenWelcome = localStorage.getItem("ecolifeSeenWelcome");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      if (seenWelcome === "true") {
        setHasSeenWelcome(true);
      }
    }
  }, []);

  const handleSignUpSuccess = async (userData: UserData) => {
    setUser(userData);
    setShowSignUpForm(false);

    // Check if user just completed assessment and is signing up to access dashboard
    if (pendingDashboardAccess && onboardingFormData) {
      // User completed assessment -> signed up -> submit onboarding data to backend
      setPendingDashboardAccess(false);

      // Submit the assessment data to backend now that user is authenticated
      try {
        const { onboardingService } = await import("./services/onboarding");

        // Prepare lifestyle data
        const lifestyleData = {
          transportation_mode: onboardingFormData.transportation,
          diet_type: onboardingFormData.meatDairy,
          shopping_pattern: onboardingFormData.shopping,
          recycling_habits: onboardingFormData.recycling,
          reusable_items: onboardingFormData.reusables === "always" || onboardingFormData.reusables === "often",
          energy_source: onboardingFormData.homeEnergy,
          travel_frequency: onboardingFormData.planeTravel,
          paper_preference: onboardingFormData.paperDigital,
        };

        // Prepare health data
        const healthData = {
          gender: onboardingFormData.gender,
          age: parseInt(onboardingFormData.age),
          height: parseFloat(onboardingFormData.height),
          weight: parseFloat(onboardingFormData.weight),
          activity_level: onboardingFormData.activityLevel,
          wellness_goal: onboardingFormData.wellnessGoal,
          dietary_preference: onboardingFormData.dietPreference,
          allergies: onboardingFormData.allergies || [],
          medical_conditions: onboardingFormData.medicalConditions || [],
          meal_frequency: onboardingFormData.mealFrequency,
          cooking_skill: onboardingFormData.cookingSkill,
          time_available: onboardingFormData.timeAvailable,
          budget: onboardingFormData.budget,
        };

        // Submit both lifestyle and health data
        await onboardingService.submitLifestyle(lifestyleData);
        await onboardingService.submitHealth(healthData);
      } catch (err) {
        console.error("Failed to submit onboarding data after signup:", err);
        // Continue to dashboard even if submission fails
      }

      // Go to dashboard
      setShowWelcomeScreen(true);
    } else {
      // Regular signup -> show onboarding form
      setShowOnboardingForm(true);
    }
  };

  const handleSignIn = () => {
    // Show sign in form instead of directly going to dashboard
    setShowSignUpForm(false);
    setShowSignInForm(true);
  };

  const handleSignInSuccess = (userData: UserData) => {
    // User signed in successfully
    setUser(userData);
    setShowSignInForm(false);

    // Check if user was trying to access dashboard from assessment results
    if (pendingDashboardAccess) {
      setPendingDashboardAccess(false);
      setShowWelcomeScreen(true);
    } else {
      // Regular sign-in - go to dashboard
      setHasSeenWelcome(true);
      localStorage.setItem("ecolifeSeenWelcome", "true");
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcomeScreen(false);
    setHasSeenWelcome(true);
    localStorage.setItem("ecolifeSeenWelcome", "true");
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("ecolifeUser");
    localStorage.removeItem("ecolifeSeenWelcome");
    // Reset state
    setUser(null);
    setHasSeenWelcome(false);
  };

  // Show dashboard if user is logged in and has seen welcome screen
  if (user && hasSeenWelcome && !showResultsSummary && !showOnboardingForm && !showSignUpForm && !showSignInForm) {
    return <Dashboard userName={user.name} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen">
      <Header onSignInClick={() => setShowSignInForm(true)} />
      <Hero onStartJourney={() => setShowOnboardingForm(true)} />
      <OurMission />
      <ImpactStats />
      <Testimonials />
      <FinalCTA />
      <Footer />
      
      <AnimatePresence>
        {showSignUpForm && (
          <SignUpForm 
            onClose={() => setShowSignUpForm(false)}
            onSignUpSuccess={handleSignUpSuccess}
            onSignIn={handleSignIn}
          />
        )}
        {showSignInForm && (
          <SignInForm 
            onClose={() => setShowSignInForm(false)}
            onSignInSuccess={handleSignInSuccess}
            onSignUpClick={() => {
              setShowSignInForm(false);
              setShowSignUpForm(true);
            }}
          />
        )}
        {showOnboardingForm && (
          <OnboardingForm 
            onClose={() => {
              setShowOnboardingForm(false);
              // If user closed without completing, clear user data
              if (!hasSeenWelcome) {
                setUser(null);
                localStorage.removeItem("ecolifeUser");
              }
            }}
            onComplete={(formData) => {
              setShowOnboardingForm(false);
              // Store onboarding form data
              setOnboardingFormData(formData);
              // Create or update user data with info from onboarding form
              const newUser = {
                name: formData?.firstName || user?.name || "User",
                email: formData?.email || user?.email || ""
              };
              setUser(newUser);
              localStorage.setItem("ecolifeUser", JSON.stringify(newUser));
              // Show results summary instead of going directly to dashboard
              setShowResultsSummary(true);
            }}
          />
        )}
        {showResultsSummary && (
          <ResultsSummary
            formData={onboardingFormData}
            onBack={() => {
              setShowResultsSummary(false);
              setShowOnboardingForm(true);
            }}
            onContinue={() => {
              setShowResultsSummary(false);

              // Check if user is authenticated
              const token = localStorage.getItem("ecolife_token");
              if (!token || !user) {
                // User not authenticated - show signup form
                setPendingDashboardAccess(true);
                setShowSignUpForm(true);
              } else {
                // User authenticated - go to dashboard
                setShowWelcomeScreen(true);
              }
            }}
          />
        )}
        {showWelcomeScreen && user && (
          <WelcomeScreen 
            userName={user.name}
            onClose={handleWelcomeClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
