import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { MdOutlineAttachMoney, MdPerson } from 'react-icons/md';
import styled from 'styled-components';
import { Error } from '../components/Error';
import { tool } from '../utils/tool';
import { PieChart } from './PieChart';

export function Compare() {
  const [companyData, setCompanyData] = useState(null);
  const [selectData, setSelectData] = useState([
    { 候選人: '', 推薦政黨: '', data: [] },
    { 候選人: '', 推薦政黨: '', data: [] },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/mirror-media/politicalcontribution/master/legislators/2016/A02_company_all_public.csv'
        );
        if (!res.ok) {
          throw new Error('HTTP error ' + res.status);
        }
        const text = await res.text();
        const results = Papa.parse(text, { header: true });
        const transformedData = results.data.map((item) => ({
          ...item,
          收入金額: Number(item.收入金額),
        }));
        setCompanyData(transformedData);
      } catch (error) {
        setCompanyData('error');
      }
    }
    fetchData();
  }, []);

  function candidatesList() {
    const List = new Set(companyData.map((item) => item['候選人']));
    const candidatesArray = Array.from(List);
    return candidatesArray;
  }

  function selectCandidates(candidate, index) {
    const data = companyData.filter((item) => item['候選人'] === candidate);
    const newData = {
      候選人: candidate,
      推薦政黨: data[0]['推薦政黨'],
      data: data,
    };
    const updatedSelectData = [...selectData];
    updatedSelectData[index] = newData;
    setSelectData(updatedSelectData);
  }

  return (
    <Container>
      <PageTitle>2016年 | 政治人物政治獻金比較</PageTitle>
      <Wrapper>
        {selectData === 'error' && <Error />}
        {selectData.map((data, index) => (
          <CandidateContainer key={index}>
            <CandidateSelect
              name={`candidate${index}`}
              value={data['候選人']}
              onChange={(e) => selectCandidates(e.target.value, index)}
              disabled={index === 1 && selectData[0]['候選人'] === ''}>
              <option value="" disabled>
                please select
              </option>
              {companyData &&
                candidatesList().map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </CandidateSelect>

            {data['候選人'] !== '' && (
              <CompareContainer>
                <PersonContainer>
                  <Person>
                    <MdPerson />
                    {data['候選人']}
                  </Person>
                  <Group>{data['推薦政黨']}</Group>
                </PersonContainer>
                <Donate>
                  <MdOutlineAttachMoney />
                  資金總額：
                  {tool.formatMoney(
                    tool.calculateTotalAmount(data.data, '收入金額')
                  )}{' '}
                  元
                </Donate>
                <br />
                <PieChart data={data.data} index={index} />
              </CompareContainer>
            )}
          </CandidateContainer>
        ))}
      </Wrapper>
    </Container>
  );
}
const PageTitle = styled.h3`
  text-align:center;
  letter-spacing:1.2px;
  color: #ff6b0f;
`;
const Container = styled.div`
  margin:60px auto;
  max-width:800px;
`;
const Wrapper = styled.div`
  display:flex;
  gap:20px;
`;
const CandidateContainer = styled.div`
  width:50%;
`;
const CandidateSelect = styled.select`
  width:100%;
  border-radius:10px;
  padding:3px;
  margin-bottom:20px;
  outline: none;
  border: 1px solid #5b5b5b;
`;
const CompareContainer = styled.div`
  border:1px solid #f1f1f1;
  border-radius:20px;
  padding:20px;
  min-height:712px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.06);
  &:hover{
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  }
`;
const PersonContainer = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  letter-spacing:.2rem;
  font-weight:600;
  border-bottom:.5px solid #b5b5b5;
  padding-bottom:10px;
  margin-bottom:15px;
`;
const Person = styled.div`
  font-weight:600;
  font-size:24px;
  letter-spacing:.5rem;
  display:flex;
  align-items:center;
  gap:10px;
`;
const Group = styled.span`
    font-size:18px;
`;
const Donate = styled(Person)`
  letter-spacing:0.1rem;
  margin-top:10px;
`;
