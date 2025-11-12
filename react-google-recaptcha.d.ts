declare module "react-google-recaptcha" {
    import React from "react";

    interface ReCAPTCHAProps {
        sitekey: string;
        onChange?: (token: string | null) => void;
        onExpired?: () => void;
        onErrored?: () => void;
        size?: "compact" | "normal" | "invisible";
        theme?: "light" | "dark";
        badge?: "bottomright" | "bottomleft" | "inline";
        tabindex?: number;
    }

    const ReCAPTCHA: React.FC<any>;

    export default ReCAPTCHA;
}
