import { useSelector } from "react-redux";
import CharacterCard from "../CharacterCard";

const ProfilePage = () => {
  const activeCharacter = useSelector((state) => state.activeCharacter);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  return (
    <div className="page profile-page">
      <h2>Profile</h2>
      <h3>{currentPlayer.isLoading ? "Loading" : currentPlayer.data?.name}</h3>
      {!activeCharacter.isLoading && activeCharacter.data && (
        <CharacterCard character={activeCharacter.data} />
      )}
    </div>
  );
};

export default ProfilePage;
