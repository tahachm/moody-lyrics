import { useState, useEffect } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { totoAfricaLyrics } from './text.fixture';
import "./wordCloud.css"

interface ExampleProps {
  width: number;
  height: number;
  showControls?: boolean;
}

export interface WordData {
  text: string;
  value: number;
}

const colors = ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#DCDCDC', '#D3D3D3'];


function wordFreq(text: string): WordData[] {
  const words: string[] = text.replace(/\./g, '').split(/\s/);
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
}

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const words = wordFreq(totoAfricaLyrics);//Words replace from API

const fontScale = scaleLog({
  domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
  range: [10, 100],
});
const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

type SpiralType = 'archimedean' | 'rectangular';

export default function WordCloud({ width, height, showControls }: ExampleProps) {
  const [spiralType, setSpiralType] = useState<SpiralType>('archimedean');
  const [withRotation, setWithRotation] = useState(false);
  const [words, setWords] = useState<WordData[]>([]);


  useEffect(() => {
    const fetchWordData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/song-frequencies`);
        const result = await response.json();
        console.log(result);
        if (result) {
          // Update font scale based on the fetched data
          const maxValue = Math.max(...result.map((d: WordData) => d.value));
          const minValue = Math.min(...result.map((d: WordData) => d.value));
          fontScale.domain([minValue, maxValue]);

          // Set fetched words
          setWords(result);
        } else {
          console.error("Unexpected API response:", result);
        }
      } catch (error) {
        console.error("Error fetching word data:", error);
      }
    };

    fetchWordData();
  }, []);


  return (
    <>
      <div className='text-center'>
        <h1 className='text-5xl font-bold mb-8 text-white'>Most Looked Up Songs</h1>
      </div>
      <div className="wordcloud !w-full !justify-center">
        <Wordcloud
          words={words}
          width={width}
          height={height}
          fontSize={fontSizeSetter}
          font={'Impact'}
          padding={2}
          spiral={spiralType}
          rotate={withRotation ? getRotationDegree : 0}
          random={fixedValueGenerator}
        >
          {(cloudWords) =>
            cloudWords.map((w, i) => (
              <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={'middle'}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
              >
                {w.text}
              </Text>
            ))
          }
        </Wordcloud>
        {showControls && (
          <div>
            <label>
              Spiral type &nbsp;
              <select
                onChange={(e) => setSpiralType(e.target.value as SpiralType)}
                value={spiralType}
              >
                <option key={'archimedean'} value={'archimedean'}>
                  archimedean
                </option>
                <option key={'rectangular'} value={'rectangular'}>
                  rectangular
                </option>
              </select>
            </label>
            <label>
              With rotation &nbsp;
              <input
                type="checkbox"
                checked={withRotation}
                onChange={() => setWithRotation(!withRotation)}
              />
            </label>
            <br />
          </div>
        )}
      </div>
    </>
  );
}
