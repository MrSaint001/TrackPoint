/* ========================================
   TRACKPOINT APP
======================================== */

const SUPABASE_URL =
    "https://zlzbbtoainxzvgocxpmb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_MV7UbRGe-c1TiR_YE4s-vA_uX1ThRm_";

let supabaseClient = null;


/* ========================================
   LOAD SUPABASE
======================================== */

async function loadSupabase() {

    if (window.supabase) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        return supabaseClient;
    }

    await new Promise((resolve, reject) => {

        const script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);

    });

    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    return supabaseClient;
}


/* ========================================
   PASSWORD TOGGLE
======================================== */

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {

        input.type = "text";

        if (button) {
            button.textContent = "Hide";
        }

    } else {

        input.type = "password";

        if (button) {
            button.textContent = "Show";
        }
    }
}


/* ========================================
   LOGIN
======================================== */

function setupLogin() {

    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail")?.value.trim();

        const password =
            document.getElementById("loginPassword")?.value;

        const message =
            document.getElementById("loginMessage");

        if (!email || !password) {

            if (message) {
                message.textContent =
                    "Please enter your email and password.";
                message.style.color = "#dc2626";
            }

            return;
        }

        try {

            if (message) {
                message.textContent = "Signing in...";
                message.style.color = "#718096";
            }

            const supabase = await loadSupabase();

            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            if (message) {
                message.textContent =
                    "Login successful. Opening TrackPoint...";
                message.style.color = "#16a34a";
            }

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);

        } catch (error) {

            console.error("Login error:", error);

            if (message) {

                let text = error.message ||
                    "Unable to sign in.";

                if (
                    text.toLowerCase().includes("email not confirmed")
                ) {
                    text =
                        "Please verify your email before signing in.";
                }

                message.textContent = text;
                message.style.color = "#dc2626";
            }
        }

    });
}


/* ========================================
   SIGNUP
======================================== */

function setupSignup() {

    const form = document.getElementById("signupForm");

    if (!form) return;

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName")?.value.trim();

        const email =
            document.getElementById("signupEmail")?.value.trim();

        const password =
            document.getElementById("signupPassword")?.value;

        const confirmPassword =
            document.getElementById("signupConfirmPassword")?.value;

        const message =
            document.getElementById("signupMessage");


        /* -------------------------
           VALIDATION
        ------------------------- */

        if (!name || !email || !password || !confirmPassword) {

            if (message) {
                message.textContent =
                    "Please fill in all fields.";
                message.style.color = "#dc2626";
            }

            return;
        }


        if (password.length < 8) {

            if (message) {
                message.textContent =
                    "Password must be at least 8 characters.";
                message.style.color = "#dc2626";
            }

            return;
        }


        if (password !== confirmPassword) {

            if (message) {
                message.textContent =
                    "Passwords do not match.";
                message.style.color = "#dc2626";
            }

            return;
        }


        try {

            if (message) {
                message.textContent =
                    "Creating your account...";
                message.style.color = "#718096";
            }

            const supabase = await loadSupabase();


            /* -------------------------
               CREATE ACCOUNT
            ------------------------- */

            const { data, error } =
                await supabase.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        /*
                         * After the user clicks the
                         * verification email, return
                         * them to the styled TrackPoint
                         * login page.
                         */

                        emailRedirectTo:
                            window.location.origin +
                            "/login.html",

                        data: {
                            full_name: name
                        }
                    }
                });


            if (error) {
                throw error;
            }


            /* -------------------------
               SUCCESS
            ------------------------- */

            if (message) {

                message.textContent =
                    "Account created! Check your email and click the verification link.";

                message.style.color = "#16a34a";
            }


            form.reset();


        } catch (error) {

            console.error("Signup error:", error);

            if (message) {

                message.textContent =
                    error.message ||
                    "Unable to create your account.";

                message.style.color = "#dc2626";
            }
        }

    });
}


/* ========================================
   HOME PAGE LOCATION TEST
======================================== */

function requestLocation() {

    const status =
        document.getElementById("location-status");

    if (!navigator.geolocation) {

        if (status) {
            status.textContent =
                "Location is not supported by this browser.";
            status.style.color = "#dc2626";
        }

        return;
    }


    if (status) {
        status.textContent =
            "Requesting location permission...";
        status.style.color = "#718096";
    }


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                Math.round(position.coords.accuracy);


            if (status) {

                status.innerHTML =
                    "Location available.<br>" +
                    "Accuracy: " +
                    accuracy +
                    " metres";

                status.style.color = "#16a34a";
            }

            console.log("Location:", {
                latitude,
                longitude,
                accuracy
            });

        },

        function (error) {

            console.error("Location error:", error);

            if (!status) return;

            if (error.code === 1) {

                status.textContent =
                    "Location permission was denied.";

            } else if (error.code === 2) {

                status.textContent =
                    "Your location could not be determined.";

            } else if (error.code === 3) {

                status.textContent =
                    "Location request timed out.";

            } else {

                status.textContent =
                    "Unable to get your location.";
            }

            status.style.color = "#dc2626";
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


/* ========================================
   DASHBOARD AUTH
======================================== */

async function setupDashboardAuth() {

    if (!window.location.pathname.endsWith("dashboard.html")) {
        return;
    }

    try {

        const supabase = await loadSupabase();

        const {
            data: {
                user
            }
        } = await supabase.auth.getUser();


        /* -------------------------
           NOT LOGGED IN
        ------------------------- */

        if (!user) {

            window.location.href = "login.html";

            return;
        }


        /* -------------------------
           USER INFORMATION
        ------------------------- */

        const metadata =
            user.user_metadata || {};

        const fullName =
            metadata.full_name ||
            user.email?.split("@")[0] ||
            "User";


        /* Try common dashboard elements */

        const nameElements =
            document.querySelectorAll(
                "#userName, .user-name, .profile-name"
            );

        nameElements.forEach(element => {
            element.textContent = fullName;
        });


        const emailElements =
            document.querySelectorAll(
                "#userEmail, .user-email, .profile-email"
            );

        emailElements.forEach(element => {
            element.textContent =
                user.email || "";
        });


    } catch (error) {

        console.error(
            "Dashboard authentication error:",
            error
        );
    }
}


/* ========================================
   LOGOUT
======================================== */

async function trackPointLogout() {

    try {

        const supabase = await loadSupabase();

        await supabase.auth.signOut();

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    } finally {

        window.location.href = "login.html";
    }
}


/* ========================================
   START APP
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        setupLogin();

        setupSignup();

        setupDashboardAuth();

    }
);