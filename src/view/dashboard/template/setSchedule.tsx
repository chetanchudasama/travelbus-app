import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react'
import { Link, useParams } from "react-router-dom";
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { api } from "../../../common/api";
import { toast } from "react-toastify";
import moment from 'moment';
import { Dialog } from "../../../common/modal";
interface Params {
  id?: string;
}

const SetSchedule: React.FC = () => {
  const params: Params = useParams();
  const [stateEvent, setStateEvent] = useState<any>({
    calendarEvents: []
  });
  const [siteId, setSiteId] = useState<string>("");
  const [siteName, setSiteName] = useState<string>("");
  const [useTo, setUseTo] = useState<string>("");
  const [singlePathData, setSinglePathData] = useState<any>();

  const [isOpenAddPathModal, setIsOpenAddPathModal] = useState<boolean>(false);
  const [carList, setCarList] = useState<any>([]);
  const days = [ "Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat" ];

  useEffect(() => {
    getTemplateData(); //
    if (siteId) {
      getCarList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  useEffect(() => {
    getTemplateDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTemplateData = async () => {
    try {
      const { data }: any = await api({
        url: `/template/details/${params.id}`,
        method: "get",
      });
      let item: any = data.result.data;
      setSiteId(item.siteId._id);
      setSiteName(item.siteId.name);
      const selectedDays: any = [];
      for (const [index, dayData] of item.days.entries()) {
        if (dayData === 1) {
          selectedDays.push(days[index])
        }
      }
      setUseTo(selectedDays.join(','));
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const getTemplateDetail = async () => {
    try {
      const { data }: any = await api({
        url: `/path/td/list/${params.id}`,
        method: "get",
      });
      let item: any = data.result.data.paths;
      const eventList: any = [];
      for (const data of item) {
        const eventObject = {
          'resourceId': data.carId._id,
          'title': data.title ? data.title : ``,
          'start': data.location && data.location.length ? moment(data.location[0].start, "HH:mm").toISOString() : ``,
          'end': data.location && data.location.length ? moment(data.location[data.location.length - 2].end, "HH:mm").toISOString() : ``,
          'backgroundColor': "#B78989",
          'borderColor': "#B78989",
          'extendedProps': {
            // 'defId': data.template_details.template.defId,
            // 'instanceId': info.event._instance?.instanceId,
            'backgroundColor': "#B78989",
            'borderColor': "#B78989",
            'pathId': data._id,
            'carData': data.carId
          },
        }
        eventList.push(eventObject)
      }
      setStateEvent((state) => {
        return {
          ...state,
          calendarEvents: eventList
        };
      });
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  }

  const handleEventDrop = (info) => {
    // const resourceMatch = info.event._def.resourceIds![0] === info.oldEvent._def.resourceIds![0];
  }

  const handleEventClick = (info) => {
    setIsOpenAddPathModal(true);
    setSinglePathData(info.event);
  }

  const getResources = () => {
    return carList.map((selectedCar) => {
      return { id: selectedCar._id, title: selectedCar.name }
    })
  }

  const openAddPathModal = () => {
    setIsOpenAddPathModal(true);
    setSinglePathData(undefined);
  }

  const modalSaveAndRemoveClick = () => {
    setIsOpenAddPathModal(false);
    getTemplateDetail();
  }

  const getCarList = async () => {
    try {
      const { data }: any = await api({
        url: `/car/site/${siteId}`,
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

  return (
    <>
      <div className="row">
        <div className="col-6">
          <h5>Site: {siteName}</h5>
          <h6>Use To: {useTo}</h6>
        </div>
        <div className="col-6 d-flex flex-wrap align-items-end justify-content-end">
          <button
            type="button"
            className="btn button-yellow mr-2 mx-sm-2 m-2 text-white"
            onClick={openAddPathModal}
          >
            <span className="font-weight-bold">+</span> Add Path
          </button>
          <Link className="btn btn-primary mx-sm-2 m-2" to="/template">
            Back
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
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
            eventDrop={(info) => handleEventDrop(info)}
            eventClick={(info) => handleEventClick(info)}
            resources={getResources()}
            nowIndicator={true}
            events={stateEvent.calendarEvents}
          />
        </div>
      </div>
      {isOpenAddPathModal && (
        <Dialog
          name="edit"
          show={isOpenAddPathModal}
          onHide={() => setIsOpenAddPathModal(false)}
          saveAndRemoveClick={() => modalSaveAndRemoveClick()}
          action=""
          headerText="Add"
          actionText="Save"
          actionStyle="success"
          dangerActionText="Remove"
          dangerActionStyle="danger"
          siteId={siteId}
          templateId={params.id}
          pathData={singlePathData}
        />
      )}
    </>
  )
}

export default SetSchedule;