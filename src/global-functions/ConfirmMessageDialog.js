import React, { useContext, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { MyContext } from '@/context/ThemeContext';


const ConfirmMessageDialog = ({
  visible = false,
  onHide = () => {},
  title = "Notification",
  message = "",
  showConfirmButton = false,
  confirmButtonText = "Ok",
  showCancelButton = false,
  cancelButtonText = "Close",
  onConfirm = () => {},
  onCancel = () => {},
  icon = "success",
  timer,
  showCloseIcon = false,
}) => {
  const { isMobile } = useContext(MyContext);
  const textColorlassName =
    icon === "error"
      ? "text-danger"
      : icon === "success"
      ? "text-success"
      : "text-info";

  useEffect(() => {
    let timerId;
    if (visible && timer) {
      timerId = setTimeout(() => {
        onHide();
      }, timer);
    }
    return () => clearTimeout(timerId);
  }, [visible, timer, onHide]);


  const renderFooter = () => {
    return (
      <div className="d-flex justify-content-center">
        {showCancelButton && (
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded border-0 mx-3 light-theme-button"
          >
            {cancelButtonText ? cancelButtonText : "Cancel"}
          </button>
        )}
        {showConfirmButton && (
          <button
            onClick={onConfirm}
            autoFocus
            className="px-3 py-2 rounded border-0 dark-theme-button"
          >
            {confirmButtonText ? confirmButtonText : "Confirm"}
          </button>
        )}
      </div>
    );
  };

  const iconFunction = (iconVal) => {
    const iconClassName =
      iconVal === "error"
        ? "pi pi-times-circle"
        : iconVal === "success"
        ? "pi pi-check-circle"
        : "pi pi-info-circle";
    return (
      <span className={textColorlassName}>
        <i
          className={iconClassName}
          style={{ fontSize: "3.5rem", fontWeight: "400" }}
        />
      </span>
    );
  };
  return (
    <Dialog
      visible={visible}
      style={isMobile ? { width: "90vw" } : { width: "30vw" }}
      onHide={onHide}
      showHeader={showCloseIcon}
    >
      <div className="bg-light p-3 rounded">
        <p className="d-flex justify-content-center">{iconFunction(icon)}</p>
        <p
          style={{ fontSize: "2rem" }}
          className={`d-flex justify-content-center ${textColorlassName}`}
        >
          {title}
        </p>
        <p className="d-flex justify-content-center">{message}</p>
        <div>{renderFooter()}</div>
      </div>
    </Dialog>
  );
};

export default ConfirmMessageDialog;
