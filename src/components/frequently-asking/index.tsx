import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import './faq.scss';
import { Accordion } from 'react-bootstrap';
import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';

const FrequentlyAsking = () => {
  const { t } = useTranslation();
  const rewordQusAns = useSelector(
    (state: any) => state.iloReducer.frequentlyAskQuestion,
  );
  return (
    <>
      <div className="faq_wrp">
        <h1>{t('frequently-asking.Asked-Questions')}</h1>
        <div className="faq_accordian">
          <Accordion>
            {rewordQusAns?.map((dt: any, i: any) => (
              <Accordion.Item eventKey={`${i}`} key={i}>
                <Accordion.Header>{dt.question}</Accordion.Header>
                <Accordion.Body>
                  <div>{parse(dt.answer)}</div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default memo(FrequentlyAsking);
