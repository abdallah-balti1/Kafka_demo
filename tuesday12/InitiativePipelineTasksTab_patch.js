// @flow
// ... imports existants ...
import ReactTooltip from 'react-tooltip'; // ← AJOUT ticket 265729
import { ReactTooltipContainer } from 'styles'; // ← AJOUT ticket 265729
import Table from 'components/Table/Table';
import columns from './columns';
import Style from './InitiativePipelineTasksTab.style';

// ... reste des imports et du code de la classe inchangé ...

class InitiativePipelineTasksTab extends React.PureComponent {
  // ... constructor, lifecycle methods, handlers inchangés ...

  render() {
    const { tasks, isLoading /* ...autres props existantes... */ } = this.props;

    return (
      <Style.Wrapper>
        {/* ... reste du JSX existant (filtres, headers, etc.) ... */}

        <Table
          data={tasks}
          columns={columns}
          loading={isLoading}
          // ... autres props existantes de la Table ...
        />

        {/* ↓↓↓ AJOUT ticket 265729 — tooltip global pour la colonne COMMENT ↓↓↓ */}
        <ReactTooltipContainer>
          <ReactTooltip type="light" effect="solid" delayShow={200} multiline />
        </ReactTooltipContainer>
        {/* ↑↑↑ FIN AJOUT ticket 265729 ↑↑↑ */}

        {/* ... reste du JSX existant (pagination, etc.) ... */}
      </Style.Wrapper>
    );
  }
}

export default InitiativePipelineTasksTab;
