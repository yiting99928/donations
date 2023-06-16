import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PieChart } from './PieChart';

export function Compare() {
  const [companyData, setCompanyData] = useState(null);
  const [selectData, setSelectData] = useState([
    { 候選人: '', 推薦政黨: '', data: [] },
    { 候選人: '', 推薦政黨: '', data: [] },
  ]);

  useEffect(() => {
    function fetchData() {
      Papa.parse(
        'https://raw.githubusercontent.com/mirror-media/politicalcontribution/master/legislators/2016/A02_company_all_public.csv',
        {
          download: true,
          header: true,
          complete: function (results) {
            // console.log(results);
            setCompanyData(results.data);
          },
        }
      );
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

  function totalMoney(moneyData) {
    const total = moneyData.reduce((total, item) => {
      return total + Number(item['收入金額']);
    }, 0);
    return total;
  }

  console.log(selectData);
  return (
    <Container>
      <h3>候選人比較</h3>
      <Wrapper>
        {selectData.map((data, index) => (
          <div key={index}>
            <select
              name={`candidate${index}`}
              value={data['候選人']}
              onChange={(e) => selectCandidates(e.target.value, index)}>
              <option value="">please select</option>
              {companyData &&
                candidatesList().map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>

            {data['候選人'] !== '' && (
              <div>
                {data['候選人']}
                <br />
                {data['推薦政黨']}
                <br />
                {`總收入金額：${totalMoney(data.data)}`}
                <br />
                <br />
                捐贈者/支出對象/收入金額
                <PieChart data={data.data} index={index} size={300} />
              </div>
            )}
          </div>
        ))}
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
`;
const Wrapper = styled.div`
  display:flex;
`;
