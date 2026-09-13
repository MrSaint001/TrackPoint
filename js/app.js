```javascript
// ========================================
// TRACKPOINT - SUPABASE AUTHENTICATION
// ========================================

const SUPABASE_URL =
    "https://zlzbbtoainxzvgocxpmb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_MV7UbRGe-c1TiR_YE4s-vA_uX1ThRm_";


// ========================================
// LOAD SUPABASE
// ========================================

const script = document.createElement("script");

script.src =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

script.onload = () => {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    setupLogin();
    setupSignup();
    setupDashboard();
};

document.head.appendChild(script);


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
                document.getElementById(
                    "loginMessage"
                );

            const button =
                loginForm.querySelector(
                    ".auth-button"
                );


            message.textContent = "";

            button.disabled = true;
            button.textContent = "Signing in...";


            try {

                const { data, error } =
                    await window.supabaseClient.auth
                        .signInWithPassword({
                            email,
                            password
                        });


                if (error) {
                    throw error;
                }


                if (!data.user) {
                    throw new Error(
                        "Unable to sign in."
                    );
                }


                message.textContent =
                    "Login successful!";

                message.className =
                    "success-message";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 500);


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
                button.textContent = "Log in";
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
                    .getElementById(
                        "signupConfirmPassword"
                    )
                    .value;


            const message =
                document.getElementById(
                    "signupMessage"
                );

            const button =
                signupForm.querySelector(
                    ".auth-button"
                );


            // ----------------------------
            // PASSWORD CHECK
            // ----------------------------

            if (
                password !==
                confirmPassword
            ) {

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
                    await window.supabaseClient.auth
                        .signUp({

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


                // Email confirmation required
                if (
                    data.user &&
                    !data.session
                ) {

                    message.textContent =
                        "Account created! Check your email and click the verification link.";

                    message.className =
                        "success-message";


                    button.disabled = false;

                    button.textContent =
                        "Create account";

                    return;
                }


                // Confirmation disabled
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
        document.querySelector(
            ".app"
        );

    if (!dashboard) return;


    try {

        const { data, error } =
            await window.supabaseClient.auth
                .getUser();


        if (
            error ||
            !data ||
            !data.user
        ) {

            window.location.replace(
                "login.html"
            );

            return;
        }


        const user =
            data.user;


        // ----------------------------
        // USER NAME
        // ----------------------------

        const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User";


        const profileName =
            document.getElementById(
                "profileName"
            );

        if (profileName) {
            profileName.textContent =
                fullName;
        }


        // ----------------------------
        // EMAIL
        // ----------------------------

        const userEmail =
            document.getElementById(
                "userEmail"
            );

        if (userEmail) {
            userEmail.textContent =
                user.email;
        }


        // ----------------------------
        // AVATAR
        // ----------------------------

        const profileAvatar =
            document.getElementById(
                "profileAvatar"
            );

        if (profileAvatar) {

            profileAvatar.textContent =
                fullName
                    .charAt(0)
                    .toUpperCase();
        }


        // ----------------------------
        // LOGOUT
        // ----------------------------

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async function () {

                    logoutButton.disabled =
                        true;

                    logoutButton.textContent =
                        "Logging out...";


                    await window.supabaseClient.auth
                        .signOut();


                    window.location.replace(
                        "login.html"
                    );
                }
            );
        }


    } catch (error) {

        console.error(
            "Dashboard authentication error:",
            error
        );

        window.location.replace(
            "login.html"
        );
    }
}
```
