import { Link } from "react-router-dom";

const NgoShortCard = ({ data }) => (
  <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition-shadow h-full border border-gray-100">
    <img
      src={data.logo}
      alt={data.name}
      className="w-full h-40 object-cover rounded-lg mb-4 border"
    />

    <Link to={`/ngo/${data.userObjectId}`} className="text-xl capitalize text-wrap font-semibold hover:text-blue-500 hover:underline text-gray-800 truncate mb-1">{data.name}{data?.isVerified && <i className="fi fi-sr-shield-trust ml-1  text-blue-500"></i>}</Link>

    <p className="text-sm text-gray-500 mb-3 flex items-center mt-1">
      <i className="fi fi-ss-marker mr-2 mt-1"></i> {data.address.state}, {data.address.country}
    </p>

    <div className="flex flex-wrap gap-2 mb-3">
      {data.category.map((cat, idx) => (
        <span
          key={idx}
          className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
        >
          {cat}
        </span>
      ))}
    </div>

    {/* Rating & Followers */}
    <div className="flex justify-start items-center gap-5 mt-3 text-sm text-gray-600">
      <div className="flex items-center gap-1">
       <i className="fi fi-sr-star text-yellow-500"></i>
        <span>{data.averageRatings?.toFixed(1) || '0.0'}</span>
      </div>
      <div className="flex items-center gap-1">
        <i className="fi fi-sr-user text-indigo-500"></i>
        <span>{data.totalFollowers || 0}</span>
      </div>
    </div>

    {/* Follow Button
    <button className="mt-4 w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium py-1.5 rounded-lg flex items-center justify-center gap-2 transition">
      <i className="fi fi-rr-user-add text-md"></i>
      Follow
    </button> */}
  </div>
);

export default NgoShortCard;
