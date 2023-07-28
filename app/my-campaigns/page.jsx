"use client"

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase/firebase";
import { getAllUserCampaigns } from '../lib/features/campaignSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '../components/Card/Card';
import PaymentModal from '../components/KickOff/KickOff';

const MyCampaigns = () => {
    const [user, loading] = useAuthState(auth)
    const dispatch = useDispatch()
    const router = useRouter()
    const modalIsOpen = useSelector((state) => state.kickOffModal.isOpen)
    const userCampaigns = useSelector((state) => state.campaign.campaign)

    const getUserCampaigns = async () => {
        const userId = user.uid
        dispatch(getAllUserCampaigns(userId))
    }

    useEffect(() => {
        if (!loading) {
            getUserCampaigns()
        }
    }, [loading])

    return (
        user &&
        <main>
            {modalIsOpen && <PaymentModal />}
            <h3 className="text-center py-5">Your Campaigns</h3>
            <div className="container mx-auto grid grid-cols-3 place-items-center gap-5 pb-5">
                {
                    Array.isArray(userCampaigns) && userCampaigns.length > 0 && userCampaigns.map((campaign, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => router.push(`/campaigns/${campaign.id}`)}
                            >
                                <Card key={campaign.id} title={campaign.data.projectName} goal={campaign.data.goal} img={campaign.data.image} raised={campaign.data.raised} />
                            </div>
                        )
                    })
                }
            </div>
        </main>
    )
}

export default MyCampaigns