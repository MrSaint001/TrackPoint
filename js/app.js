```javascript
// ========================================
// TRACKPOINT - SUPABASE AUTHENTICATION
// ========================================

const SUPABASE_URL =
    "https://zlzbbtoainxzvgocxpmb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_MV7UbRGe-c1TiR_YE4s-vA_uX1ThRm_";

// ========================================
// SUPABASE CLIENT
// ========================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

// ========================================
// SHOW / HIDE PASSWORD
// ========================================

function togglePassword(inputId, button) {

    const input =
        document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
    } else {
        input.type = "password";
        button.textContent = "Show";
    }
}

// ========================================
// LOGIN
// ========================================

function setupLogin() {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            const message =
                document.getElementById("loginMessage");

            const button =
                loginForm.querySelector(".auth-button");

            message.textContent = "";
            message.className = "";

            button.disabled = true;
            button.textContent = "Signing in...";

            try {

                const { data, error } =
                    await supabaseClient.auth
                        .signInWithPassword({
                            email: email,
                            password: password
                        });

                if (error) {
                    throw error;
                }

                if (!data.session) {
                    throw new Error(
                        "Login failed. No session was created."
                    );
                }

                message.textContent =
                    "Login successful!";

                message.className =
                    "success-message";

                window.location.href =
                    "dashboard.html";

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                message.textContent =
                    error.message ||
                    "Unable to sign in.";

                message.className =
                    "error-message";

                button.disabled = false;
                button.textContent = "Sign in";
            }
        }
    );
}

// ========================================
// SIGN UP
// ========================================

function setupSignup() {

    const signupForm =
        document.getElementById("signupForm");

    if (!signupForm) return;

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("signupPassword")
                    .value;

            const confirmPassword =
                document
                    .getElementById("signupConfirmPassword")
                    .value;

            const message =
                document.getElementById("signupMessage");

            const button =
                signupForm.querySelector(".auth-button");

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.className =
                    "error-message";

                return;
            }

            if (password.length < 8) {

                message.textContent =
                    "Password must be at least 8 characters.";

                message.className =
                    "error-message";

                return;
            }

            button.disabled = true;
            button.textContent =
                "Creating account...";

            try {

                const redirectUrl =
                    window.location.origin +
                    "/login.html";

                const { data, error } =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            data: {
                                full_name: name
                            },

                            emailRedirectTo:
                                redirectUrl
                        }
                    });

                if (error) {
                    throw error;
                }

                if (
                    data.user &&
                    !data.session
                ) {

                    message.textContent =
                        "Account created! Check your email and verify your account.";

                    message.className =
                        "success-message";

                    button.disabled = false;
                    button.textContent =
                        "Create account";

                    return;
                }

                message.textContent =
                    "Account created successfully!";

                message.className =
                    "success-message";

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);

            } catch (error) {

                console.error(
                    "Signup error:",
                    error
                );

                message.textContent =
                    error.message ||
                    "Unable to create your account.";

                message.className =
                    "error-message";

                button.disabled = false;

                button.textContent =
                    "Create account";
            }
        }
    );
}

// ========================================
// DASHBOARD AUTHENTICATION
// ========================================

async function setupDashboard() {

    const dashboard =
        document.querySelector(".app");

    if (!dashboard) return;

    try {

        const {
            data: {
                session
            }
        } =
            await supabaseClient.auth.getSession();

        if (!session) {

            window.location.replace(
                "login.html"
            );

            return;
        }

        const user =
            session.user;

        c
```
