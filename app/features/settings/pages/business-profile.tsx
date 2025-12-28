import Profile from "../components/profile"
import { getBusiness } from "../server-actions/business"

export default async function BusinessProfile() {
    const business = await getBusiness()
    return (
        <>
        {
            business?.data && <Profile business={business.data} />
        }
        </>
    )
}