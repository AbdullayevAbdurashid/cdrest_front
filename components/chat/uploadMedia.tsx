import React from "react";
import TextInput from "components/inputs/textInput";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { setNewMessage } from "redux/slices/chat";
import { storage } from "services/firebase";
import PrimaryButton from "components/button/primaryButton";
import SecondaryButton from "components/button/secondaryButton";
import { warning } from "components/alert/toast";
import { useAppDispatch } from "hooks/useRedux";
import { useTranslation } from "react-i18next";

type Props = {
  url: string;
  setPercent?: (num: number) => void;
  file: any;
  handleOnSubmit: (url: string) => void;
  handleClose: () => void;
};

export default function UploadMedia({
  url,
  setPercent = (num: number) => {},
  file,
  handleOnSubmit,
  handleClose,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleUpload = () => {
    if (!file) {
      warning("Please upload an image first!");
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
        if (percent === 100) {
        }
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          handleOnSubmit(url);
        });
      }
    );
  };

  const handleChange = (text: string) => {
    dispatch(setNewMessage(text));
  };

  return (
    <div className="upload-media">
      <div className="upload-form">
        <img src={url} />
        <div>
          <TextInput
            label="Caption"
            onChange={(e) => {
              handleChange(e.target.value);
            }}
          />
        </div>
        <div className="footer-btns">
          <SecondaryButton type="button" onClick={handleClose}>
            {t("cancel")}
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleUpload}>
            {t("send")}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
