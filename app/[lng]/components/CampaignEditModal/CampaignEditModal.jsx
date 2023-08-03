"use client";

import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { TiDeleteOutline } from 'react-icons/ti';
import { BsFillSendCheckFill } from 'react-icons/bs'
import "react-datepicker/dist/react-datepicker.css";
import "./CampaignEditModal.css";
import Button from "../Button/Button";
import { auth } from "../../../firebase/firebase";
import { useForm, Controller } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    updateCurrentCampaign,
    getCurrentCampaign
} from "@/app/lib/features/campaignSlice";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/app/lib/features/campaignEditSlice";
import { useTranslation } from "../../../i18n/client";
import Select from "react-select";

const CampaignEditModal = ({ lng, campaignId }) => {
    const [user, loading] = useAuthState(auth);
    const dispatch = useDispatch();
    const { t } = useTranslation(lng, "kickOff");
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        setValue
    } = useForm();
    const [uploadState, setUploadState] = useState(true)
    const [uploadedFileName, setUploadedFileName] = useState(null)
    const [previewImage, setPreviewImage] = useState(null);

    const multiValueRemoveStyles = "text-theme bg-accent-black";
    const multiValueLabelStyles = "text-accent-black bg-theme";
    const currentCampaign = useSelector((state) => state.campaign.currentCampaign)
    const currentUser = useSelector((state) => state.user.user);

    const getCurrentCampaignData = async () => {
        await dispatch(getCurrentCampaign(campaignId))
    }

    useEffect(() => {
        if (!loading) {
            getCurrentCampaignData()
        }
    }, [loading]);

    const categoryOptions = [
        { label: t("Education"), value: t("Education") },
        { label: t("Culture"), value: t("Culture") },
        { label: t("Animals"), value: t("Animals") },
        { label: t("Children"), value: t("Children") },
    ];

    const onSubmit = async (data) => {
        const { projectName, about, file, category } = data;
        const userId = user.uid;
        await dispatch(
            updateCurrentCampaign({
                projectName,
                about,
                file,
                category,
                userId,
                campaignId
            })
        );
        await dispatch(closeModal());
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
        setUploadedFileName(null)
        setUploadState(true)
        setValue('file', null);
    }

    const handleModalToggle = () => {
        dispatch(closeModal());
    };

    return (currentCampaign &&
        <main>
            <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-zinc-950 bg-opacity-50 modal-background">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-slate-50 lg:w-[50%] lg:h-[auto] rounded-xl p-4 flex flex-col justify-between sm:w-[75%] sm:h-[75%]"
                >
                    <div>
                        <div>
                            <Button type="button" clickAction={handleModalToggle}>
                                <IoIosArrowBack size={28} />
                            </Button>
                        </div>
                        <div className="lg:m-2 md:m-0 lg:my-4 md:my-1 lg:text-[40px] md:text-[20px]">
                            {t("Edit")}
                            <br /> {t("your campaign")}
                        </div>
                        <div className="flex flex-col md:flex-row justify-between m-2">
                            <div className="flex flex-col lg:mx-4">
                                <div className="flex flex-col">
                                    <label className="font-mulish text-lg md:text-[18px]">
                                        {t("Name of your campaign")}
                                    </label>
                                    <input
                                        {...register("projectName", {
                                            required: true,
                                            pattern:
                                                /^(?=.*[a-zA-Z])[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*(?:\s[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*)*$/,
                                        })}
                                        defaultValue={currentCampaign.projectName}
                                        className="title-input bg-slate-50 p-2 input-field focus:outline-none focus:ring-0 project-name-input"
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
                                                defaultValue={currentCampaign.category}
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
                            <div className="lg:mx-4 md:w-auto">
                                <div className="flex flex-col">
                                    <label className="font-mulish text-lg md:text-[18px]">
                                        {t("About your campaign")}
                                    </label>
                                    <input
                                        {...register("about", {
                                            required: true,
                                            pattern:
                                                /^(?=.*[a-zA-Z])[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*(?:\s[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*)*$/,
                                        })}
                                        placeholder={t(
                                            "So many cats, so little homes. We want to provide home and care to them all. Help us build a dream shelter for all cats in our town."
                                        )}
                                        className="title-input bg-slate-50 lg:py-7 md:py-1 input-field focus:outline-none focus:ring-0"
                                        defaultValue={currentCampaign.about}
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
                                <div className="flex flex-col items-center lg:my-10 md:my-1">
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
                                            <span className="text-black px-4 text-[18px]">{t("Add media")}</span>
                                            <span className="text-black pb-4 text-[12px]">(.jpg/.jpeg/.png)</span>
                                            <label htmlFor="file-input" className="flex justify-center">
                                                <FaUpload className="border-[1px] border-black rounded-lg p-3 cursor-pointer" size={40} />
                                            </label>
                                        </>) : (
                                        <>
                                            <div className="flex gap-2 justify-center items-center">
                                                <span className="text-black text-[15px] text-center mb-1">File ready to be uploaded</span>
                                                <BsFillSendCheckFill title={uploadedFileName} size={26} className='mb-2' />
                                            </div>
                                            {previewImage && <img src={previewImage} alt="Preview" className="h-1/2 w-1/2 mb-1" title={uploadedFileName} />}
                                            <div className="flex gap-2 justify-center items-center">
                                                <span className="text-[15px] ">{uploadedFileName.substring(0, 8).split('.')[0] + uploadedFileName.slice(-4)}</span>
                                                <TiDeleteOutline onClick={deleteFile} size={30} />
                                            </div>
                                        </>)
                                    }
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
                    <div className="flex justify-end lg:mt-5 md:mt-auto">
                        <Button
                            type="submit"
                            style="bg-zinc-950 rounded-md w-full p-2 text-white text-[15px]"
                        >
                            {t("Upload campaign")}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CampaignEditModal;
