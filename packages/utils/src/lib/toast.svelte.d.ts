export default toast;
export type ConfigProps = {
    type: "info" | "success" | "primary" | "danger" | "warning" | "error" | "default";
    timeout: number;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    showCloseButton: boolean;
    closeOnClick: boolean;
    pauseOnHover: boolean;
    showProgressBar: boolean;
    transition: "bounce" | "slide" | "fade";
    transitionDuration: number;
    message: string;
    title: string;
};
declare namespace toast {
    let show: (arg0: string | Object, arg1?: Object | undefined) => void;
    let success: (arg0: string | Object, arg1?: Object | undefined) => void;
    let warning: (arg0: string | Object, arg1?: Object | undefined) => void;
    let danger: (arg0: string | Object, arg1?: Object | undefined) => void;
    let info: (arg0: string | Object, arg1?: Object | undefined) => void;
}
