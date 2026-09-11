// ========================================
// TRACKPOINT - SUPABASE
// ========================================

const SUPABASE_URL = "https://zlzbbtoainxzvgocxpmb.supabase.co";
const SUPABASE_KEY = "sb_publishable_MV7UbRGe-c1TiR_YE4s-vA_uX1ThRm_";


// ========================================
// LOAD SUPABASE
// ========================================

const script = document.createElement("script");

script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

script.onload = () => {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    setupLogin();
    setupSignup();
    setupDashboard();;
};

document.head.appendChild(script);


// ========================================
// SHOW / HIDE PASSWORD
// ========================================

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) {
        console.error("Password input not found:", inputId);
        return;
    }

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

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        const button =
            loginForm.querySelector(".auth-button");

        message.textContent = "";

        button.disabled = true;
        button.textContent = "Signing in...";

        try {

            const { data, error } =
    await window.supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {

            data: {
                full_name: name
            },

            emailRedirectTo:
                "http://localhost:3000/login.html"

        }

    });
}


// ========================================
// SIGN UP
// ========================================

function setupSignup() {

    const signupForm =
        document.getElementById("signupForm");

    if (!signupForm) return;

    signupForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById(
                "signupConfirmPassword"
            ).value;

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

            const { data, error } =
                await window.supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {
                            full_name: name
                        }

                    }

                });


            if (error) throw error;


            if (data.user && !data.session) {

                message.textContent =
                    "Account created! Check your email to confirm your account.";

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

            }, 800);


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
    });
}

// ========================================
// DASHBOARD AUTHENTICATION
// ========================================

async function setupDashboard() {

    const userEmail =
        document.getElementById("userEmail");

    const logoutButton =
        document.getElementById("logoutButton");

    const accountStatus =
        document.getElementById("accountStatus");

    if (!userEmail && !logoutButton) {
        return;
    }

    const { data, error } =
        await window.supabaseClient.auth.getUser();

    if (error || !data.user) {

        window.location.href =
            "login.html";

        return;
    }

    const user = data.user;

    userEmail.textContent =
        "Signed in as: " + user.email;

    accountStatus.textContent =
        "Account active";

    logoutButton.addEventListener(
        "click",
        async function () {

            await window.supabaseClient.auth.signOut();

            window.location.href =
                "login.html";
        }
    );
}

// ========================================
// DASHBOARD
// ========================================

async function setupDashboard() {

    const logoutButton =
        document.getElementById("logoutButton");

    const userEmail =
        document.getElementById("userEmail");

    const profileName =
        document.getElementById("profileName");

    const profileAvatar =
        document.getElementById("profileAvatar");

    if (!logoutButton && !userEmail) {
        return;
    }

    // Get logged-in user
    const { data, error } =
        await window.supabaseClient.auth.getUser();

    if (error || !data.user) {

        window.location.href = "login.html";

        return;
    }

    const user = data.user;

    // ========================================
    // GET USER NAME
    // ========================================

    const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

    // Show name
    if (profileName) {
        profileName.textContent = fullName;
    }

    // Show email
    if (userEmail) {
        userEmail.textContent = user.email;
    }

    // Show first letter
    if (profileAvatar) {
        profileAvatar.textContent =
            fullName.charAt(0).toUpperCase();
    }


    // ========================================
    // LOGOUT
    // ========================================

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

                logoutButton.disabled = true;
                logoutButton.textContent = "Logging out...";

                await window.supabaseClient.auth.signOut();

                window.location.href = "login.html";
            }
        );

    }


    // ========================================
    // NAVIGATION
    // ========================================

    const trackerButton =
        document.getElementById("trackerButton");

    const startTracking =
        document.getElementById("startTracking");

    const selectDevice =
        document.getElementById("selectDevice");


    function openTracker() {

        alert(
            "Phone Tracker\n\n" +
            "The tracker section is ready. " +
            "Next we will connect your authorized device."
        );

    }


    if (trackerButton) {

        trackerButton.addEventListener(
            "click",
            openTracker
        );

    }


    if (startTracking) {

        startTracking.addEventListener(
            "click",
            openTracker
        );

    }


    if (selectDevice) {

        selectDevice.addEventListener(
            "click",
            function () {

                alert(
                    "No devices connected yet.\n\n" +
                    "The device connection system will be added next."
                );

            }
        );

    }


    // ========================================
    // SIDEBAR BUTTONS
    // ========================================

    const navItems =
        document.querySelectorAll(
            ".side-nav .nav-item"
        );

    navItems.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                navItems.forEach(function(item) {

                    item.classList.remove("active");

                });

                button.classList.add("active");

                const text =
                    button.textContent.trim();

                if (text === "Dashboard") {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

                else if (text === "Phone Tracker") {

                    openTracker();

                }

                else if (text === "My Devices") {

                    alert(
                        "My Devices\n\n" +
                        "Your connected devices will appear here."
                    );

                }

                else if (text === "Locations") {

                    alert(
                        "Locations\n\n" +
                        "Saved device locations will appear here."
                    );

                }

                else if (text === "Alerts") {

                    alert(
                        "Alerts\n\n" +
                        "Device alerts will appear here."
                    );

                }

            }
        );

    });


    // ========================================
    // SETTINGS
    // ========================================

    const settingsButton =
        document.querySelector(
            ".sidebar-bottom .nav-item"
        );

    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            function() {

                alert(
                    "Settings\n\n" +
                    "Account and tracking settings will be added here."
                );

            }
        );

    }

}