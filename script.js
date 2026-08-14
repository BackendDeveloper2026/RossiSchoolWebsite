document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("contactForm");

    const button =
        document.getElementById("submitButton");

    const formMessage =
        document.getElementById("form-message");

    const website =
        document.getElementById("website");

    const email =
        document.getElementById("email");

    const messageField =
        document.getElementById("messaggio");

    const counter =
        document.getElementById("counter");


    if (!form) {
        return;
    }


    /* ==================================================
       CONTATORE MESSAGGIO
    ================================================== */

    if (messageField && counter) {

        messageField.addEventListener(
            "input",
            () => {

                counter.textContent =
                    `${messageField.value.length} / 2000`;

            }
        );

    }


    /* ==================================================
       FUNZIONI ERRORE
    ================================================== */

    function setError(
        fieldId,
        errorId,
        text
    ) {

        const field =
            document.getElementById(fieldId);

        const error =
            document.getElementById(errorId);


        if (field) {

            field.classList.add(
                "input-error"
            );

            field.classList.remove(
                "input-valid"
            );

        }


        if (error) {
            error.textContent = text;
        }

    }


    function clearError(
        fieldId,
        errorId
    ) {

        const field =
            document.getElementById(fieldId);

        const error =
            document.getElementById(errorId);


        if (field) {

            field.classList.remove(
                "input-error"
            );

            field.classList.add(
                "input-valid"
            );

        }


        if (error) {
            error.textContent = "";
        }

    }


    /* ==================================================
       MESSAGGIO GENERALE
    ================================================== */

    function showMessage(
        text,
        type
    ) {

        formMessage.className =
            `form-message ${type}`;

        formMessage.textContent =
            text;

    }


    /* ==================================================
       RESET ERRORI
    ================================================== */

    function resetErrors() {

        const fields = [
            "nome",
            "cognome",
            "email",
            "telefono",
            "messaggio"
        ];


        fields.forEach(
            (fieldId) => {

                const field =
                    document.getElementById(
                        fieldId
                    );

                if (field) {

                    field.classList.remove(
                        "input-error",
                        "input-valid"
                    );

                }

            }
        );


        document
            .querySelectorAll(".field-error")
            .forEach(
                (element) => {

                    element.textContent = "";

                }
            );

    }


    /* ==================================================
       VALIDAZIONE
    ================================================== */

    function validateForm() {

        let valid = true;


        const nome =
            document
                .getElementById("nome")
                .value
                .trim();


        const cognome =
            document
                .getElementById("cognome")
                .value
                .trim();


        const emailValue =
            email.value
                .trim();


        const telefono =
            document
                .getElementById("telefono")
                .value
                .trim();


        const messaggio =
            messageField.value
                .trim();


        const privacy =
            document
                .getElementById("privacy")
                .checked;


        /* ----------------------------
           NOME
        ----------------------------- */

        if (
            nome.length < 2 ||
            nome.length > 50
        ) {

            setError(
                "nome",
                "nome-error",
                "Inserisci un nome valido."
            );

            valid = false;

        } else {

            clearError(
                "nome",
                "nome-error"
            );

        }


        /* ----------------------------
           COGNOME
        ----------------------------- */

        if (
            cognome.length < 2 ||
            cognome.length > 50
        ) {

            setError(
                "cognome",
                "cognome-error",
                "Inserisci un cognome valido."
            );

            valid = false;

        } else {

            clearError(
                "cognome",
                "cognome-error"
            );

        }


        /* ----------------------------
           EMAIL
        ----------------------------- */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailRegex.test(emailValue) ||
            emailValue.length > 120
        ) {

            setError(
                "email",
                "email-error",
                "Inserisci un indirizzo email valido."
            );

            valid = false;

        } else {

            clearError(
                "email",
                "email-error"
            );

        }


        /* ----------------------------
           TELEFONO
        ----------------------------- */

        if (telefono !== "") {

            const phoneRegex =
                /^[0-9+().\s-]{6,25}$/;


            if (
                !phoneRegex.test(
                    telefono
                )
            ) {

                setError(
                    "telefono",
                    "telefono-error",
                    "Inserisci un numero di telefono valido."
                );

                valid = false;

            } else {

                clearError(
                    "telefono",
                    "telefono-error"
                );

            }

        }


        /* ----------------------------
           MESSAGGIO
        ----------------------------- */

        if (
            messaggio.length < 10 ||
            messaggio.length > 2000
        ) {

            setError(
                "messaggio",
                "messaggio-error",
                "Il messaggio deve contenere tra 10 e 2000 caratteri."
            );

            valid = false;

        } else {

            clearError(
                "messaggio",
                "messaggio-error"
            );

        }


        /* ----------------------------
           PRIVACY
        ----------------------------- */

        if (!privacy) {

            showMessage(
                "Devi accettare l'informativa sulla privacy.",
                "error"
            );

            valid = false;

        }


        return valid;

    }


    /* ==================================================
       INVIO A WEB3FORMS
    ================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            resetErrors();


            formMessage.className =
                "form-message";

            formMessage.textContent =
                "";


            /* ----------------------------
               HONEYPOT
            ----------------------------- */

            if (
                website &&
                website.value.trim() !== ""
            ) {

                return;

            }


            /* ----------------------------
               VALIDAZIONE
            ----------------------------- */

            if (!validateForm()) {

                return;

            }


            /* ----------------------------
               REPLY-TO
            ----------------------------- */

            document
                .getElementById("replyto")
                .value =
                email.value.trim();


            /* ----------------------------
               DISABILITA PULSANTE
            ----------------------------- */

            button.disabled = true;


            const buttonText =
                button.querySelector(
                    "span:first-child"
                );


            if (buttonText) {

                buttonText.textContent =
                    "Invio in corso...";

            }


            try {

                /* ------------------------
                   PREPARA DATI
                ------------------------- */

                const formData =
                    new FormData(form);


                /* ------------------------
                   INVIA A WEB3FORMS
                ------------------------- */

                const response =
                    await fetch(
                        "https://api.web3forms.com/submit",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const result =
                    await response.json();


                /* ------------------------
                   SUCCESSO
                ------------------------- */

                if (
                    result.success
                ) {

                    form.reset();


                    if (counter) {

                        counter.textContent =
                            "0 / 2000";

                    }


                    showMessage(
                        "Grazie! Ti ricontatteremo presto.",
                        "success"
                    );


                } else {

                    throw new Error(
                        result.message ||
                        "Errore durante l'invio."
                    );

                }


            } catch (error) {

                console.error(
                    "Errore Web3Forms:",
                    error
                );


                showMessage(
                    "Si è verificato un errore durante l'invio. Riprova tra poco oppure contattaci telefonicamente.",
                    "error"
                );


            } finally {

                button.disabled =
                    false;


                if (buttonText) {

                    buttonText.textContent =
                        "Invia richiesta";

                }

            }

        }
    );


    /* ==================================================
       LINK INTERNI
    ================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {

                            return;

                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (target) {

                            event.preventDefault();


                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                    }
                );

            }
        );

});