const SUPABASE_URL =
"https://zlzbbtoainxzvgocxpmb.supabase.co";

const SUPABASE_KEY =
"sb_publishable_MV7UbRGe-c1TiR_YE4s-vA_uX1ThRm_";

/* ========================================
SUPABASE
======================================== */

if (!window.supabase) {

```
console.error("TrackPoint: Supabase did not load.");
```

} else {

```
window.supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
```

}

/* ========================================
PASSWORD SHOW / HIDE
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
const form =
    document.getElementById("loginForm");

if (!form) return;


form.addEventListener("submit", async function(event) {

    event.preventDefault();

    console.log("TrackPoint: login form submitted.");


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
        document.getElementById("loginButton");


    message.textContent = "Signing in...";
    button.disabled = true;


    try {

        if (!window.supabaseClient) {

            throw new Error(
                "Supabase client was not created."
            );

        }


        const { data, error } =
            await window.supabaseClient.auth.signInWithPassword({

                email: email,
                password: password

            });


        if (error) {

            console.error(
                "TrackPoint login error:",
                error
            );

            message.textContent =
                error.message || "Login failed.";

            button.disabled = false;

            return;

        }


        console.log(
            "TrackPoint: login successful.",
            data
        );


        message.textContent =
            "Login successful. Opening dashboard...";


        window.location.replace(
            "dashboard.html"
        );


    } catch (error) {

        console.error(
            "TrackPoint login exception:",
            error
        );

        message.textContent =
            error.message ||
            "Something went wrong.";

        button.disabled = false;

    }

});
```

}

/* ========================================
SIGNUP
======================================== */

function setupSignup() {

```
const form =
    document.getElementById("signupForm");

if (!form) return;


form.addEventListener("submit", async function(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("signupEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("signupPassword")
            .value;

    const message =
        document.getElementById("signupMessage");

    const button =
        document.getElementById("signupButton");


    message.textContent =
        "Creating account...";

    if (button) {
        button.disabled = true;
    }


    try {

        if (!window.supabaseClient) {

            throw new Error(
                "Supabase client was not created."
            );

        }


        const { data, error } =
            await window.supabaseClient.auth.signUp({

                email: email,
                password: password

            });


        if (error) {

            console.error(
                "TrackPoint signup error:",
                error
            );

            message.textContent =
                error.message ||
                "Could not create account.";

            if (button) {
                button.disabled = false;
            }

            return;

        }


        console.log(
            "TrackPoint: signup successful.",
            data
        );


        message.textContent =
            "Account created successfully.";


        setTimeout(function() {

            window.location.replace(
                "dashboard.html"
            );

        }, 1000);


    } catch (error) {

        console.error(
            "TrackPoint signup exception:",
            error
        );

        message.textContent =
            error.message ||
            "Something went wrong.";

        if (button) {
            button.disabled = false;
        }

    }

});
```

}

/* ========================================
DASHBOARD AUTH CHECK
======================================== */

async function setupDashboard() {

```
if (!window.supabaseClient) {

    console.error(
        "TrackPoint: Supabase client unavailable."
    );

    return;

}


const {
    data,
    error
} =
    await window.supabaseClient.auth.getSession();


if (error || !data.session) {

    window.location.replace(
        "login.html"
    );

    return;

}


console.log(
    "TrackPoint: dashboard authenticated."
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
        "TrackPoint app.js loaded."
    );


    setupLogin();
    setupSignup();

    if (
        window.location.pathname
            .toLowerCase()
            .includes("dashboard.html")
    ) {

        setupDashboard();

    }

}
```

);
