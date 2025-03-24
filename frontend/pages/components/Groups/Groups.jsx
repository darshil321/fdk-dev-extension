import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import urlJoin from 'url-join';
import './Groups.css';
import { Button } from 'paul-fds-ui';


const EXAMPLE_MAIN_URL = window.location.origin;

const Groups = ({ companyId }) => {
  const [groups, setGroups] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { application_id } = useParams();

  useEffect(() => {
    isApplicationLaunch() ? fetchApplicationGroups() : fetchGroups();
  }, [application_id]);

  const fetchGroups = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(urlJoin(EXAMPLE_MAIN_URL, '/api/groups'), {
        headers: {
          'x-company-id': companyId
        }
      });
      setGroups(data.items);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchApplicationGroups = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(urlJoin(EXAMPLE_MAIN_URL, `/api/groups/application/${application_id}`), {
        headers: {
          'x-company-id': companyId
        }
      });
      setGroups(data.items);
    } catch (error) {
      console.error('Error fetching application groups:', error);
    } finally {
      setPageLoading(false);
    }
  };


  console.log('fetchApplicationGroups',groups);
  const isApplicationLaunch = () => !!application_id;

  if (pageLoading) {
    return (
      <div className="loader" data-testid="loader">

      </div>
    );
  }

  if (groups?.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Groups Found</h2>
        <p>
          Combines multiple SKUs into one offer by creating a group, where users can select only one product from each group.
        </p>
        <div className="button-group">
          <Button
            appearance="default"
            kind="secondary"
            onClick={() => window.open('https://partners.fynd.com/docs/groups', '_blank')}
            size="m"
          >
            Learn More
          </Button>
          <Button
            appearance="default"
            kind="primary"
            onClick={() => {/* Open create group modal/page */}}
            size="m"
          >
            Create Group
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="groups-list">
      {/* Groups list will go here */}
    </div>
  );
};

export default Groups;
