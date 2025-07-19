import React, { useState, useEffect } from "react";
import ngoDatabaseServices from "../../databaseService/ngo.database.service";
import { useAuth } from "../../context/AuthContext";

const NGOProfile = ({ ngo }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [followed, setFollowed] = useState(false);

    useEffect(() => {
        if (user?.user) {
            setLiked(user.user.favoriteNgos?.includes(ngo._id));
            setFollowed(user.user.followingNgos?.includes(ngo._id));
        }
    }, [user, ngo]);

    const handleToggleLike = async () => {
        try {
            const newLikeStatus = !liked;
            const res = await ngoDatabaseServices.followNgo({
                ngoId: ngo._id,
                like: newLikeStatus,
                follow: followed, // preserve follow status
            });

            if (res.success) setLiked(newLikeStatus);
        } catch (err) {
            console.error("Error toggling like:", err.message);
        }
    };

    const handleToggleFollow = async () => {
        try {
            const newFollowStatus = !followed;
            const res = await ngoDatabaseServices.followNgo({
                ngoId: ngo._id,
                like: liked, // preserve like status
                follow: newFollowStatus,
            });

            if (res.success) setFollowed(newFollowStatus);
        } catch (err) {
            console.error("Error toggling follow:", err.message);
        }
    };

    const socialIcons = {
        facebook: "fi fi-brands-facebook",
        twitter: "fi fi-brands-twitter",
        instagram: "fi fi-brands-instagram",
        linkedin: "fi fi-brands-linkedin",
    };

    if (!ngo) return <div>Loading profile...</div>;

    return (
        <div className="w-full px-6 py-10 pt-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-2">
                    <h1 className="text-3xl capitalize font-bold text-slate-800 flex items-center gap-2">
                        {ngo.name}
                        {ngo.isVerified && <i className="fi fi-sr-shield-trust text-xl text-blue-500"></i>}
                    </h1>
                    <p className="text-md w-fit px-4 rounded-lg py-1 bg-gray-100 font-semibold  text-slate-500">Reg. No: <span className="text-indigo-500">{ngo.registrationNumber}</span></p>
                    <div className="flex gap-2 flex-wrap">
                        {ngo.category.map((cat, i) => (
                            <span key={i} className="px-2 py-1 border border-indigo-300 text-sm rounded-full  bg-blue-50 capitalize">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="border-4 border-indigo-500 rounded-full overflow-hidden">
                    <img
                    src={ngo.logo}
                    alt="NGO Logo"
                    className="w-24 h-24 object-cover rounded-full border"
                />
                </div>
            </div>

            <hr className="border-slate-200" />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 shadow-md rounded-lg p-6 text-slate-700">
                <div>
                    <p className="text-sm font-medium">Official Email</p>
                    <p>{ngo.officialContactEmail}</p>
                </div>
                <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>+ {ngo.officialContactPhone}</p>
                </div>
                <div>
                    <p className="text-sm font-medium">Status</p>
                    <p>{ngo.isVerified ? "Verified" : "Unverified"} / {ngo.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div className="col-span-full">
                    <p className="text-sm font-medium">Address</p>
                    <p className="capitalize">
                        {[ngo.address.street, ngo.address.district, ngo.address.city, ngo.address.state, "PIN - " + ngo.address.postalCode, ngo.address.country].filter(Boolean).join(", ")}
                    </p>
                </div>
                <div className="col-span-full">
                    <p className="text-sm font-medium">Website</p>
                    <p>{ngo.website ? <a href={ngo.website} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{ngo.website}</a> : "N/A"}</p>
                </div>
            </div>

            {/* Description */}
            {ngo?.description &&<div className="bg-gray-50 relative shadow-md rounded-lg p-6">
                <div className="text-md text-slate-500 mb-6">
                    <span className="text-indigo-600 transform rotate-180 relative -top-3 mr-1 inline-block"><i className="fi fi-rr-quote-right "></i></span>
                    {ngo?.description}
                    <span className="text-indigo-600 relative -top-1 ml-1"><i className="fi fi-rr-quote-right"></i></span>
                </div>
                <p className="text-md italic absolute bottom-2 right-20 text-slate-400">- {ngo?.name}</p>
            </div>
            }

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center bg-gray-50 shadow-md p-6 rounded-lg">
                <div>
                    <p className="text-lg font-bold text-indigo-600">{ngo.donationCount}</p>
                    <p className="text-sm text-slate-500">Donations</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-indigo-600">{ngo.averageRatings.toFixed(1)}/5</p>
                    <p className="text-sm text-slate-500">Avg. Rating</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-indigo-600">{ngo.totalRatings}</p>
                    <p className="text-sm text-slate-500">Total Ratings</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-indigo-600">{ngo.searchCount}</p>
                    <p className="text-sm text-slate-500">Search Count</p>
                </div>
            </div>

            {/* Follow/Like + Social Media */}
            <div className="flex flex-col md:flex-row bg-gray-50 items-center justify-between gap-4 px-6 py-6">
                <div className="flex gap-4">
                    <button onClick={handleToggleLike} className="flex items-center gap-2 px-5 py-2 rounded-lg text-gray-700">
                        <i className={`fi fi-sr-heart mt-1 ${liked ? "text-red-500" : ""}`}></i>
                        {liked ? "Liked" : "Like"}
                    </button>
                    <button onClick={handleToggleFollow} className="flex items-center gap-2 px-5 py-2 rounded-lg text-gray-700">
                        <i className={`fi fi-sr-user-add mt-1 ${followed ? "text-blue-500" : ""}`}></i>
                        {followed ? "Following" : "Follow"}
                    </button>
                </div>

                {ngo.socialMediaLinks && (
                    <div className="flex gap-4">
                        {Object.entries(ngo.socialMediaLinks).map(([platform, url]) => (
                            url && (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-600 hover:text-indigo-600 text-xl"
                                >
                                    <i className={socialIcons[platform]}></i>
                                </a>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NGOProfile;
