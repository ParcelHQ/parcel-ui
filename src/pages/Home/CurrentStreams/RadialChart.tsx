import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import styled from '@emotion/styled';
import { Progress } from 'reactstrap';

const primary = '#7367F0';
const primaryLight = '#9c8cfc';
// const brown = '#8D6E63';
// const brownLight = '#DBAE8E';
const orange = '#ff9f43';
const orangeLight = '#FFB976';

const BottomBox = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  margin: 1.75rem 1rem 2rem;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  flex-wrap: nowrap;
  font-size: 0.9375rem;
  max-width: 14rem;
`;

const TopBox = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const Title = styled.span`
  margin-top: 0.09375rem;
`;

const Stat = styled.span`
  font-weight: 700;
  margin-left: 0.5rem;
`;

export default function RadialChart({ series, totalStreamValue }: any) {
  if (isNaN(series[0])) series[0] = 50;
  series[1] = 0;

  const [streamedProgress, setStreamedProgress] = useState(50);
  const [withdrawnProgress, setWithdrawnProgress] = useState(0);

  useEffect(() => {
    if (series) {
      setStreamedProgress(series[0]);
      if (series[2] === !undefined) setWithdrawnProgress(series[2]);
      else setWithdrawnProgress(0);
    }
  }, [series]);

  const [options, setOptions] = useState<any>({
    colors: [primary, orange],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: [primaryLight, orangeLight],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },

    plotOptions: {
      radialBar: {
        size: 150,
        hollow: {
          size: '40%',
        },
        track: {
          strokeWidth: '100%',
          margin: 15,
        },
        dataLabels: {
          name: {
            fontSize: '18px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            fontSize: '24px',
            label: 'Total',

            formatter: () => {
              let value = totalStreamValue ? totalStreamValue : 50;

              return value;
            },
          },
        },
      },
    },
    labels: ['Streaming', 'Withdrawn'],
  });

  useEffect(() => {
    if (totalStreamValue) {
      setOptions({
        colors: [primary, orange],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: [primaryLight, orangeLight],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },

        plotOptions: {
          radialBar: {
            size: 150,
            hollow: {
              size: '40%',
            },
            track: {
              strokeWidth: '100%',
              margin: 15,
            },
            dataLabels: {
              name: {
                fontSize: '18px',
              },
              value: {
                fontSize: '16px',
              },
              total: {
                show: true,
                fontSize: '24px',
                label: 'Total',

                formatter: () => {
                  return totalStreamValue;
                },
              },
            },
          },
        },
        labels: ['Streaming', 'Withdrawn'],
      });
    }
    return () => {};
  }, [totalStreamValue]);

  return (
    <>
      <Chart options={options} series={series} type="radialBar" height={350} />
      <BottomBox>
        <Box>
          <TopBox>
            <Title>Streamed</Title>
            <Stat>{`${streamedProgress} %`}</Stat>
          </TopBox>
          <div style={{ width: '100px' }}>
            <Progress animated color="primary" value={streamedProgress} />
          </div>
        </Box>
        <Box>
          <TopBox>
            <Title>Withdrawn</Title>
            <Stat>{`${withdrawnProgress} %`}</Stat>
          </TopBox>
          <div style={{ width: '100px' }}>
            <Progress animated color="warning" value={0} />
          </div>
        </Box>
      </BottomBox>
    </>
  );
}
