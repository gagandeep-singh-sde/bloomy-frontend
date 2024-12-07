import { useState } from "react";
import bcrypt from "bcryptjs";
import "./App.css";

const salt = "$2b$04$xdBYzsZt7/06MWHpfx8TR.";

function App() {
  const [password, setPassword] = useState("");
  const [encryptedPassword, setEncryptedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [validationStatus, setValidationStatus] = useState({
    lengthCheck: false,
    uppercaseCheck: false,
    lowercaseCheck: false,
    digitCheck: false,
    specialCharCheck: false,
  });

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValidationStatus(validatePassword(newPassword));
  };

  const validatePassword = (password) => {
    const lengthCheck = password.length === 5;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const digitCheck = /\d/.test(password);
    const specialCharCheck = /[!@#$%^&*]/.test(password);

    return {
      lengthCheck,
      uppercaseCheck,
      lowercaseCheck,
      digitCheck,
      specialCharCheck,
    };
  };

  const handleEncryptPassword = () => {
    if (encryptedPassword) {
      navigator.clipboard.writeText(encryptedPassword);
      setCopied(true);
    } else {
      const {
        lengthCheck,
        uppercaseCheck,
        lowercaseCheck,
        digitCheck,
        specialCharCheck,
      } = validationStatus;
      if (
        lengthCheck &&
        uppercaseCheck &&
        lowercaseCheck &&
        digitCheck &&
        specialCharCheck
      ) {
        const hash = bcrypt.hashSync(password, salt);
        setEncryptedPassword(hash);
        localStorage.setItem("originalPassword", password);
        setError("");
      } else {
        setError(
          "Password must be 5 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character from !@#$%^&*"
        );
      }
    }
  };

  return (
    <div className="bg-img">
      <div className="content">
        <div className="sub-content">
          <h1 className="m-0">Enter a 5 character Password:</h1>
          <div className="card">
            {encryptedPassword ? (
              <input
                type="text"
                placeholder={encryptedPassword}
                value={encryptedPassword}
                disabled
                className="input"
              />
            ) : (
              <input
                type="password"
                placeholder="Enter password"
                maxLength={5}
                value={password}
                onChange={handlePasswordChange}
                className="input"
              />
            )}
            <div className="validation-status">
              <p className={validationStatus.lengthCheck && "success"}>
                Must be 5 characters long
              </p>
              <p className={validationStatus.uppercaseCheck && "success"}>
                Must contain at least 1 uppercase letter
              </p>
              <p className={validationStatus.lowercaseCheck && "success"}>
                Must contain at least 1 lowercase letter
              </p>
              <p className={validationStatus.digitCheck && "success"}>
                Must contain at least 1 digit
              </p>
              <p className={validationStatus.specialCharCheck && "success"}>
                Must contain at least 1 special character from !@#$%^&*
              </p>
            </div>
            <button
              className={
                validationStatus.lengthCheck &&
                validationStatus.uppercaseCheck &&
                validationStatus.lowercaseCheck &&
                validationStatus.digitCheck &&
                validationStatus.specialCharCheck
                  ? "visible"
                  : "hidden"
              }
              onClick={handleEncryptPassword}
              disabled={
                !(
                  validationStatus.lengthCheck &&
                  validationStatus.uppercaseCheck &&
                  validationStatus.lowercaseCheck &&
                  validationStatus.digitCheck &&
                  validationStatus.specialCharCheck
                )
              }
            >
              {encryptedPassword
                ? copied
                  ? "Copied"
                  : "Copy"
                : "Encrypt Password"}
            </button>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
