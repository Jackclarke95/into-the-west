import CharacterTable from "../Tables/CharacterTable";
import BasePage from "./BasePage";

const CharactersPage = () => {
  return (
    <BasePage pageTitle="Characters" noPadding>
      <CharacterTable />
    </BasePage>
  );
};

export default CharactersPage;
