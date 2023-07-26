"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "app/firebase/firebase.jsx";
import { getAllUserCampaigns } from "../../lib/features/campaignSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "../../components/Card/Card";
import PaymentModal from "../components/KickOff/KickOff";
import { useTranslation } from "../../i18n/client";

const MyCampaigns = ({ lng }) => {
  const [user, loading] = useAuthState(auth);
  const { t } = useTranslation(lng, "myCampaings");
  const dispatch = useDispatch();

  const modalIsOpen = useSelector((state) => state.modal.isOpen);
  const userCampaigns = useSelector((state) => state.campaign.campaign);

  const getUserCampaigns = async () => {
    const userId = user.uid;
    dispatch(getAllUserCampaigns(userId));
  };

  useEffect(() => {
    if (!loading) {
      getUserCampaigns();
    }
  }, [loading]);

  return (
    user && (
      <main>
        {modalIsOpen && <PaymentModal />}
        <h3 className="text-center py-5">{t("Your Campaigns")}</h3>
        <div className="container mx-auto grid grid-cols-3 place-items-center gap-5 pb-5">
          {userCampaigns.length > 0 &&
            userCampaigns.map((campaign) => {
              return (
                <Card
                  key={campaign.id}
                  title={campaign.data.projectName}
                  goal={campaign.data.goal}
                  img={campaign.data.image}
                  raised={campaign.data.raised}
                />
              );
            })}
        </div>
      </main>
    )
  );
};

export default MyCampaigns;