import Image from "next/image";

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <Image
        src={user?.photoURL || "/hacker.png"}
        alt="profile image"
        width={117.44}
        height={117.44}
        className="card-img-center"
      />
      <p>
        <i>@{user?.username}</i>
      </p>
      <h1>{user?.displayName}</h1>
    </div>
  );
}
