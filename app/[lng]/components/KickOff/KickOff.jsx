"use client";

import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { FaUpload, FaCalendarAlt } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { BsFillSendCheckFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./KickOff.css";
import Button from "../Button/Button";
import { auth } from "../../../firebase/firebase";
import { useForm, Controller } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addUserCampaign,
  getAllUserCampaigns,
} from "@/app/lib/features/campaignSlice";
import { getUserData } from "@/app/lib/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/app/lib/features/kickOffModalSlice";
import { useTranslation } from "../../../i18n/client";
import Select from "react-select";
import { toast } from "react-toastify";

const PaymentModal = ({ lng }) => {
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();
  const { t } = useTranslation(lng, "kickOff");
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm();
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [uploadState, setUploadState] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const today = new Date();
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  const multiValueRemoveStyles = "text-theme bg-accent-black";
  const multiValueLabelStyles = "text-accent-black bg-theme";
  const currentUser = useSelector((state) => state.user.user);

  const getCurrentUserData = async () => {
    await dispatch(getUserData(user.uid));
  };

  useEffect(() => {
    if (!loading) {
      getCurrentUserData();
    }
  }, [loading]);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
  };

  const categoryOptions = [
    { label: t("Education"), value: "Education" },
    { label: t("Culture"), value: "Culture" },
    { label: t("Animals"), value: "Animals" },
    { label: t("Children"), value: "Children" },
  ];

  const handleCalendarIconClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const onSubmit = async (data) => {
    const { projectName, goal, about, file, category } = data;
    const userId = user.uid;
    const currentUserName = currentUser.name;
    await dispatch(
      addUserCampaign({
        currentUserName,
        projectName,
        goal,
        about,
        file,
        category,
        startDate,
        endDate,
        userId,
        formatDate,
        today,
        nextMonth,
      })
    );
    await dispatch(getAllUserCampaigns(userId));
    await dispatch(closeModal());
    toast.success(t("Campaign launched successfully."), {
      toastId: "campaign-launch-succeeded",
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadState(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFileName("");
      setUploadState(true);
      setPreviewImage(null);
    }
  };

  const deleteFile = () => {
    setUploadedFileName(null);
    setUploadState(true);
    setValue("file", null);
  };

  const handleCancel = () => {
    setShowCalendar(false);
  };

  const handleModalToggle = () => {
    dispatch(closeModal());
  };

  return (
    <main>
      <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-zinc-950 bg-opacity-50 modal-background z-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-50 lg:w-[65%] lg:h-[auto] md:h-[60%] rounded-xl p-4 flex flex-col justify-between sm:w-[75%] sm:h-[auto]"
        >
          <div>
            <div>
              <Button type="button" clickAction={handleModalToggle}>
                <IoIosArrowBack size={28} />
              </Button>
            </div>
            <div className="lg:m-2 md:m-0 lg:my-4 md:my-1 lg:text-[38px] md:text-[20px] md:mx-4">
              {t("Kick-off")}
              <br /> {t("your campaign")}
            </div>
            <div className="flex flex-col md:flex-row justify-between m-2">
              <div className="flex flex-col lg:mx-4 md:px-4">
                <div className="flex flex-col">
                  <label className="font-mulish text-lg md:text-[18px]">
                    {t("Name of your campaign")}
                  </label>
                  <input
                    {...register("projectName", {
                      required: true,
                      pattern:
                        /^(?=.*[a-zA-ZçÇşŞğĞüÜıİöÖ])[a-zA-ZçÇşŞğĞüÜıİöÖ\d\W]+(?:-[a-zA-ZçÇşŞğĞüÜıİöÖ\d\W]+)*(?:\s[a-zA-ZçÇşŞğĞüÜıİöÖ\d\W]+(?:-[a-zA-ZçÇşŞğĞüÜıİöÖ\d\W]+)*)*$/,
                    })}
                    placeholder={t("Build a cat shelter with us!")}
                    className="title-input mb-4 text-[20px] bg-slate-50 py-0 input-field focus:outline-none focus:ring-0 project-name-input"
                  />
                  {errors.projectName?.type === "required" && (
                    <p
                      role="alert"
                      className="text-end text-red-600 italic text-[14px]"
                    >
                      {t("Campaign name is required")}
                    </p>
                  )}
                  {errors.projectName?.type === "pattern" && (
                    <p
                      role="alert"
                      className="text-end text-red-600 italic text-[14px]"
                    >
                      {t("Campaign name is invalid")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col relative">
                  <label className="font-mulish text-lg md:text-[18px]">
                    {t("Add your goal")}
                  </label>
                  <span className="absolute left-1 top-[28px] text-black text-[20px] font-KronaOne">
                    $
                  </span>
                  <input
                    {...register("goal", {
                      required: true,
                      pattern: /^[1-9][0-9]*$/,
                    })}
                    className="bg-slate-50 text-black pl-7 text-[20px] w-full input-field focus:outline-none focus:ring-0 p-0"
                  />
                  {errors.goal?.type === "required" && (
                    <p
                      role="alert"
                      className="text-end text-red-600 italic text-[14px]"
                    >
                      {t("Goal is required")}
                    </p>
                  )}
                  {errors.goal?.type === "pattern" && (
                    <p
                      role="alert"
                      className="text-end text-red-600 italic text-[14px]"
                    >
                      {t("Goal is invalid")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="font-mulish text-lg md:text-[18px] md:pt-2">
                    {t("Add your timeline")}
                  </label>
                  <div className="flex flex-row justify-between relative">
                    <input
                      type="text"
                      name="input-field"
                      autoComplete="off"
                      className="title-input text-[15px] md:text-[14px] bg-slate-50 py-0 px-2 text-black font-medium text-base leading-normal text-left uppercase input-field focus:outline-none focus:ring-0"
                      onClick={handleCalendarIconClick}
                      readOnly
                      value={
                        startDate && endDate
                          ? `${startDate
                            .getDate()
                            .toString()
                            .padStart(2, "0")}/${(startDate.getMonth() + 1)
                              .toString()
                              .padStart(2, "0")}/${startDate
                                .getFullYear()
                                .toString()
                                .slice(-2)} - ${endDate
                                  .getDate()
                                  .toString()
                                  .padStart(2, "0")}/${(endDate.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0")}/${endDate
                                      .getFullYear()
                                      .toString()
                                      .slice(-2)}`
                          : `${formatDate(today)} - ${formatDate(nextMonth)}`
                      }
                    />
                    {errors.calendar?.type === "required" && (
                      <p
                        role="alert"
                        className="text-end text-red-600 italic text-[14px]"
                      >
                        {t("Timeline is required")}
                      </p>
                    )}
                    <FaCalendarAlt
                      className="border-[1px] border-black rounded-lg p-3 absolute right-2 top-[-15px] cursor-pointer"
                      size={40}
                      onClick={handleCalendarIconClick}
                    />
                    {showCalendar && (
                      <div className="calendar-modal absolute h-auto top-[40%] right-[5%] custom-calendar">
                        <div className="text-right mr-2">
                          <Button type="button" clickAction={handleCancel}>
                            <CgClose
                              className="mt-2 mr-1 font-bold"
                              size={20}
                            />
                          </Button>
                        </div>
                        <div className="calendar-container">
                          <DatePicker
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                            selectsRange
                            inline
                            calendarClassName="custom-calendar"
                            showYearDropdown
                            showMonthDropdown
                            yearDropdownItemNumber={5}
                            minDate={today}
                            dayClassName={(date) => {
                              if (date <= today) {
                                return "past-day";
                              } else {
                                return undefined;
                              }
                            }}
                          />
                        </div>
                        <div className="confirm-button h-8 mb-2">
                          <Button
                            type="button"
                            clickAction={handleCalendarIconClick}
                          >
                            {t("Confirm")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mt-5">
                  <label className="font-mulish text-lg md:text-[18px]">
                    {t("Select categories for your campaign")}
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={categoryOptions}
                        isMulti
                        onChange={(value) => field.onChange(value)}
                        onBlur={() => field.onBlur()}
                        placeholder={t("Education") + ", " + t("Culture")}
                        isSearchable
                        noOptionsMessage={() => {
                          t("No category found...");
                        }}
                        classNames={{
                          multiValueRemove: () => multiValueRemoveStyles,
                          multiValueLabel: () => multiValueLabelStyles,
                        }}
                      />
                    )}
                  />
                  {errors.category?.type === "required" && (
                    <p
                      role="alert"
                      className="text-end text-red-600 italic text-[14px]"
                    >
                      {t("Category is required")}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-zinc-400 border rounded border-zinc-400 h-auto"></div>
              <div className="lg:mx-4 lg:w-[50%] md:w-[75%] md:mx-4">
                <div className="flex flex-col max-md:mt-4">
                  <label className="font-mulish text-lg md:text-[18px]">
                    {t("About your campaign")}
                  </label>
                  <input
                    {...register("about", {
                      required: true,
                      pattern:
                        /^(?=.*[a-zA-ZçÇşŞğĞüÜıİöÖ])[a-zA-ZçÇşŞğĞüÜıİöÖ\d\W]+(?:-[a-zA-ZçÇşŞğĞüÜıİöÖ\d\W]+)*(?:\s[a-zA-ZçÇşŞğĞüÜıİöÖ\d\W]+(?:-[a-zA-ZçÇşŞğĞüÜıİöÖ\d\W]+)*)*$/,
                    })}
                    placeholder={t(
                      "So many cats, so little homes. We want to provide home and care to them all. Help us build a dream shelter for all cats in our town."
                    )}
                    className="title-input text-[20px] bg-slate-50 lg:py-0 md:py-1 input-field focus:outline-none focus:ring-0"
                  />
                  {errors.about?.type === "required" && (
                    <p
                      role="alert"
                      className="text-end text-red-600 italic text-[14px]"
                    >
                      {t("About is required")}
                    </p>
                  )}
                  {errors.about?.type === "pattern" && (
                    <p
                      role="alert"
                      className="text-end text-red-600 italic text-[14px]"
                    >
                      {t("About is invalid")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center lg:my-10 md:my-1 max-md:mt-4 md:mt-4">
                  <input
                    {...register("file", { required: true })}
                    type="file"
                    className="hidden"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onInput={handleFileChange}
                  />
                  {uploadState ? (
                    <>
                      <span className="text-black px-4 text-[18px]">
                        {t("Add media")}
                      </span>
                      <span className="text-black pb-4 text-[12px]">
                        (.jpg/.jpeg/.png)
                      </span>
                      <label
                        htmlFor="file-input"
                        className="flex justify-center"
                      >
                        <FaUpload
                          className="border-[1px] border-black rounded-lg p-3 cursor-pointer"
                          size={40}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2 justify-center items-center">
                        <span className="text-black text-[15px] text-center mb-1">
                          File ready to be uploaded
                        </span>
                        <BsFillSendCheckFill
                          title={uploadedFileName}
                          size={26}
                          className="mb-2"
                        />
                      </div>
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-1/2 w-1/2 mb-1"
                          title={uploadedFileName}
                        />
                      )}
                      <div className="flex gap-2 justify-center items-center">
                        <span className="text-[15px] ">
                          {uploadedFileName.substring(0, 8).split(".")[0] +
                            uploadedFileName.slice(-4)}
                        </span>
                        <TiDeleteOutline onClick={deleteFile} size={30} />
                      </div>
                    </>
                  )}
                  {errors.file?.type === "required" && (
                    <p
                      role="alert"
                      className="text-end text-red-600 italic text-[14px]"
                    >
                      {t("Media is required")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end lg:mt-5 md:mt-1">
            <Button
              type="submit"
              style="bg-zinc-950 rounded-md w-full p-2 text-white text-[15px]"
            >
              {t("Launch campaign")}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PaymentModal;
