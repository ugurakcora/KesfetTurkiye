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
import { loginUser, clearError } from "../store/authSlice";
import { CommonActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
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
          routes: [{ name: "MainApp" }],
        })
      );
    }
  }, [isAuthenticated]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    const emailValid = validateEmail(email);
    const passwordValid = password.length >= 6;

    setIsEmailValid(emailValid);
    setIsPasswordValid(passwordValid);

    if (emailValid && passwordValid) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <ImageBackground
        source={require("../assets/login-bg.jpg")}
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
                <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
                <Text style={styles.subtitleText}>
                  Türkiye'nin kültürel hazinelerini keşfedin
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
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Giriş Yap</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation.navigate("Signup")}
              >
                <Text style={styles.signupButtonText}>
                  Hesabınız yok mu? Kayıt olun
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
  loginButton: {
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
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    marginTop: 20,
  },
  signupButtonText: {
    color: "#666",
    textAlign: "center",
    fontSize: 14,
  },
});

export default LoginScreen;
