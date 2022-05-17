import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react'
import { Link, useLocation, useParams } from "react-router-dom";
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { api } from "../../../common/api";
import { toast } from "react-toastify";
import moment from 'moment';
import { ScheduleDailyDialog } from "./scheduleDailyModal";
import { Tab, Tabs } from "react-bootstrap";

interface Params {
  siteId?: string;
}

const ScheduleDailyTemplate: React.FC = () => {
  const params: Params = useParams();
  const [carList, setCarList] = useState<any>([]);
  const [stateEvent, setStateEvent] = useState<any>({
    calendarEvents: [],
    pathCalendarEvents: []
  });
  const [key, setKey] = useState('schedule');
  const [siteName, setSiteName] = useState("");
  const location: any = useLocation();
  const [isOpenAddPathModal, setIsOpenAddPathModal] = useState<boolean>(false);
  const [singlePathData, setSinglePathData] = useState<any>();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (location.state.siteName) {
      setSiteName(location.state.siteName)
    }
  }, [location])

  useEffect(() => {
    if (params.siteId) {
      // getPathList();
      getCarList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.siteId]);

  useEffect(() => {
    getScheduleDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getScheduleDetail = async () => {
    try {
      const { data }: any = await api({
        url: `/schedule/sc/list/${params.siteId}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const eventList: any = [];
        const pathEventList: any = [];
        let item: any = data.result.data.schedules;
        for (const element of item) {
          for (const [index, locationData] of element.location.entries()) {
            if (index !== element.location.length - 1) {
              const pathEventObject = {
                'resourceId': element.carId,
                'title': locationData.location_id ? `${element.location[index].location_id.name} > ${element.location[index + 1].location_id.name}` : ``,
                'start': locationData ? moment(locationData.start, "HH:mm").toISOString() : ``,
                'end': locationData ? moment(locationData.end, "HH:mm").toISOString() : ``,
                'backgroundColor': "#B78989",
                'borderColor': "#B78989",
                'extendedProps': {
                  'backgroundColor': "#B78989",
                  'borderColor': "#B78989",
                  'scheduleId': element._id,
                  'title': locationData.location_id ? `${element.location[index].location_id.name} > ${element.location[index + 1].location_id.name}` : ``,
                  'status': element.status
                },
              }
              pathEventList.push(pathEventObject);
            }
          }
          const eventObject = {
            'resourceId': element.carId,
            'title': element.title ? element.title : ``,
            'start': element.location && element.location.length ? moment(element.location[0].start, "HH:mm").toISOString() : ``,
            'end': element.location && element.location.length ? moment(element.location[element.location.length - 2].end, "HH:mm").toISOString() : ``,
            'backgroundColor': "#B78989",
            'borderColor': "#B78989",
            'extendedProps': {
              'backgroundColor': "#B78989",
              'borderColor': "#B78989",
              'scheduleId': element._id,
              'title': element.title ? element.title : ``,
              'status': element.status
            },
          }
          eventList.push(eventObject)
          pathEventList.push(eventObject);
        }

        setStateEvent((state) => {
          return {
            ...state,
            calendarEvents: eventList,
            pathCalendarEvents: pathEventList
          };
        });
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  }

  const getCarList = async () => {
    try {
      const { data }: any = await api({
        url: `/car/site/${params.siteId}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const carListResponse = data.result.data.carData;
        setCarList(carListResponse);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const handleEventClick = (info) => {
    setSinglePathData(info.event);
    setIsOpenAddPathModal(true);
    setIsEditMode(true)
  }

  const getResources = () => {
    return carList.map((selectedCar) => {
      return { id: selectedCar._id, title: selectedCar.name }
    })
  }

  const openAddPathModal = () => {
    setIsOpenAddPathModal(true);
    setIsEditMode(false)
    setSinglePathData(undefined);
  }

  const modalSaveAndRemoveClick = () => {
    getScheduleDetail()
    setIsOpenAddPathModal(false);
  }
  
  const getStatusColor = (status) => {
    return status.toLowerCase() === "delay" ? "red" : "blue"; 
  }

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <p style={{ fontSize: "8px" }}>{eventInfo.event.extendedProps.title} </p>
        {eventInfo.event.extendedProps.status.toLowerCase() === "normal" ? "" :
          <>
            <p color={getStatusColor(eventInfo.event.extendedProps.status)}>
              {eventInfo.event.extendedProps.status}
            </p>
          </>
        }
      </>
    )
  }

  return (
    <div>
      <div>
        <div className="d-flex flex-wrap align-items-end justify-content-end">
          <button
            type="button"
            className="btn button-yellow mr-2 mx-sm-2 m-2 text-white"
            onClick={openAddPathModal}
          >
            <span className="font-weight-bold">+</span> Add Path
          </button>
          <Link className="btn btn-primary mx-sm-2 m-2" to="/schedule/daily">
            Back
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-2">
          <span className="mt-2 font-weight-bold">Site: {siteName}</span>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="schedule" title="Schedule">
              <FullCalendar
                droppable={true}
                schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                timeZone='local'
                plugins={[resourceTimeGridPlugin, interactionPlugin]}
                initialView='resourceTimeGridDay'
                allDaySlot={false}
                headerToolbar={{
                  left: '',
                  center: '',
                  right: ''
                }}
                eventDurationEditable={false}
                eventOverlap={false}
                slotDuration={'00:05:00'}
                eventClick={(info) => handleEventClick(info)}
                resources={getResources()}
                events={stateEvent.calendarEvents}
                nowIndicator={true}
                eventContent={renderEventContent}
              />
            </Tab>
            <Tab eventKey="path" title="Path">
              {key === "path" &&
                <>
                  <FullCalendar
                    droppable={true}
                    schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                    timeZone='local'
                    plugins={[resourceTimeGridPlugin, interactionPlugin]}
                    initialView='resourceTimeGridDay'
                    allDaySlot={false}
                    headerToolbar={{
                      left: '',
                      center: '',
                      right: ''
                    }}
                    eventDurationEditable={false}
                    slotDuration={'00:05:00'}
                    eventClick={(info) => handleEventClick(info)}
                    resources={getResources()}
                    events={stateEvent.pathCalendarEvents}
                    nowIndicator={true}
                    eventContent={renderEventContent}
                  />
                </> 
              }
            </Tab>
          </Tabs>
        </div>
      </div>
      {isOpenAddPathModal && (
        <ScheduleDailyDialog
          name="edit"
          isEditMode={isEditMode}
          show={isOpenAddPathModal}
          onHide={() => setIsOpenAddPathModal(false)}
          saveAndRemoveClick={() => modalSaveAndRemoveClick()}
          action=""
          headerText={isEditMode ? "Edit" : "Add"}
          actionText="Save"
          actionStyle="success"
          dangerActionText="Remove"
          dangerActionStyle="danger"
          siteId={params.siteId || ''}
          scheduleData={singlePathData}
        />
      )}
    </div>
  )
}

export default ScheduleDailyTemplate;