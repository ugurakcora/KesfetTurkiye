import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Keyboard,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearError } from "../store/authSlice";
import { CommonActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      dispatch(clearError());
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "BottomTabs" }],
        })
      );
    }
  }, [isAuthenticated, navigation]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    const emailValid = validateEmail(email);
    const passwordValid = password.length >= 6;
    const confirmPasswordValid = password === confirmPassword;

    setIsEmailValid(emailValid);
    setIsPasswordValid(passwordValid);
    setIsConfirmPasswordValid(confirmPasswordValid);

    if (emailValid && passwordValid && confirmPasswordValid) {
      dispatch(signupUser({ email, password }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <ImageBackground
        source={require("../assets/signup-bg.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              keyboardStatus && styles.scrollContentWithKeyboard,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Kayıt Ol</Text>
                <Text style={styles.subtitleText}>
                  Türkiye'nin kültürel hazinelerini keşfetmeye başlayın
                </Text>
              </View>

              <View style={styles.inputsContainer}>
                <Input
                  placeholder="E-posta"
                  leftIcon={
                    <Icon
                      name="email"
                      type="material"
                      size={24}
                      color={isEmailValid ? "#666" : "#FF385C"}
                    />
                  }
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  errorMessage={
                    !isEmailValid ? "Geçerli bir e-posta adresi girin" : ""
                  }
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />

                <Input
                  placeholder="Şifre"
                  leftIcon={
                    <Icon
                      name="lock"
                      type="material"
                      size={24}
                      color={isPasswordValid ? "#666" : "#FF385C"}
                    />
                  }
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon
                        name={showPassword ? "visibility-off" : "visibility"}
                        type="material"
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  }
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  errorMessage={
                    !isPasswordValid ? "Şifre en az 6 karakter olmalıdır" : ""
                  }
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />

                <Input
                  placeholder="Şifre Tekrar"
                  leftIcon={
                    <Icon
                      name="lock"
                      type="material"
                      size={24}
                      color={isConfirmPasswordValid ? "#666" : "#FF385C"}
                    />
                  }
                  rightIcon={
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Icon
                        name={
                          showConfirmPassword ? "visibility-off" : "visibility"
                        }
                        type="material"
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  }
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  errorMessage={
                    !isConfirmPasswordValid ? "Şifreler eşleşmiyor" : ""
                  }
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.signupButtonText}>Kayıt Ol</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.loginButtonText}>
                  Zaten hesabınız var mı? Giriş yapın
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  scrollContentWithKeyboard: {
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  inputsContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  errorText: {
    color: "#FF385C",
    textAlign: "center",
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "#FF385C",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    marginTop: 20,
  },
  loginButtonText: {
    color: "#666",
    textAlign: "center",
    fontSize: 14,
  },
});

export default SignupScreen;
