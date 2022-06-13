import Image from "next/image";

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      {/* Don't know why I need to wrap <Image/> with a div to correctly display it */}
      <div>
        <Image
          src={user?.photoURL || "/hacker.png"}
          alt="profile image"
          width={117.44}
          height={117.44}
          className="card-img-center"
        />
      </div>
      <p>
        <i>@{user?.username}</i>
      </p>
      <h1>{user?.displayname}</h1>
    </div>
  );
}
