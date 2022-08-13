import { useSelector } from "react-redux";
import CharacterCard from "../CharacterCard";
import SessionCard from "../SessionCard";

const ProfilePage = () => {
  const activeCharacter = useSelector((state) => state.activeCharacter);
  const sessions = useSelector((state) => state.sessions);

  return (
    <div className="page profile-page">
      {!activeCharacter.isLoading && activeCharacter.data && (
        <CharacterCard character={activeCharacter.data} />
      )}
      {!sessions.isLoading && sessions.data && (
        <SessionCard session={sessions.data[0]} />
      )}
    </div>
  );
};

export default ProfilePage;
