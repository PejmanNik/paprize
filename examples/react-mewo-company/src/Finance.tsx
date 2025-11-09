import LoremIpsum from './LoremIpsum';
import Chart from './Chart';
import PageContainer from './PageContainer';
import Title from './Title';

function Finance() {
    return (
        <PageContainer>
            <Title>Finance</Title>
            <LoremIpsum />
            <Chart />
            <LoremIpsum />
        </PageContainer>
    );
}

export default Finance;
