const SUPABASE_URL =
"https://zlzbbtoainxzvgocxpmb.supabase.co";

const SUPABASE_KEY =
"sb_publishable_MV7UbRGe-c1TiR_YE4s-vA_uX1ThRm_";

/* ========================================
CREATE SUPABASE CLIENT
======================================== */

const supabaseClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

/* ========================================
PASSWORD TOGGLE
======================================== */

function togglePassword(inputId, button) {

```
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
```

}

/* ========================================
LOGIN
======================================== */

function setupLogin() {

```
const loginForm =
    document.getElementById("loginForm");

if (!loginForm) return;


loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        console.log(
            "TrackPoint login started"
        );


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


        message.textContent =
            "Signing in...";

        button.disabled = true;


        try {

            const result =
                await supabaseClient.auth
                    .signInWithPassword({
                        email: blessingumeh80@gmail.com,
                        password: Ifech$kwu1
                    });


            if (result.error) {

                console.error(
                    "Login error:",
                    result.error
                );

                message.textContent =
                    result.error.message;

                button.disabled = false;

                return;
            }


            console.log(
                "TrackPoint login successful"
            );


            message.textContent =
                "Login successful. Opening dashboard...";


            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Login exception:",
                error
            );

            message.textContent =
                error.message ||
                "Unable to sign in.";

            button.disabled = false;

        }

    }
);
```

}

/* ========================================
SIGN UP
======================================== */

function setupSignup() {

```
const signupForm =
    document.getElementById(
        "signupForm"
    );

if (!signupForm) return;


signupForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document
                .getElementById(
                    "signupName"
                )
                .value
                .trim();

        const email =
            document
                .getElementById(
                    "signupEmail"
                )
                .value
                .trim();

        const password =
            document
                .getElementById(
                    "signupPassword"
                )
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


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        if (password.length < 8) {

            message.textContent =
                "Password must be at least 8 characters.";

            return;
        }


        button.disabled = true;

        message.textContent =
            "Creating account...";


        try {

            const result =
                await supabaseClient.auth
                    .signUp({

                        email: email,

                        password: password,

                        options: {

                            data: {
                                full_name: name
                            }

                        }

                    });


            if (result.error) {

                console.error(
                    "Signup error:",
                    result.error
                );

                message.textContent =
                    result.error.message;

                button.disabled = false;

                return;
            }


            if (
                result.data.user &&
                !result.data.session
            ) {

                message.textContent =
                    "Account created. Check your email to confirm your account.";

                button.disabled = false;

                return;
            }


            message.textContent =
                "Account created successfully.";


            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Signup exception:",
                error
            );

            message.textContent =
                error.message ||
                "Unable to create account.";

            button.disabled = false;

        }

    }
);
```

}

/* ========================================
DASHBOARD AUTH
======================================== */

async function setupDashboard() {

```
if (
    !window.location.pathname
        .toLowerCase()
        .includes("dashboard.html")
) {
    return;
}


const {
    data,
    error
} =
    await supabaseClient.auth.getSession();


if (
    error ||
    !data.session
) {

    window.location.replace(
        "login.html"
    );

    return;
}


console.log(
    "TrackPoint dashboard authenticated"
);
```

}

/* ========================================
START
======================================== */

document.addEventListener(
"DOMContentLoaded",
function() {

```
    console.log(
        "TrackPoint app.js loaded"
    );

    setupLogin();

    setupSignup();

    setupDashboard();

}
```

);
