import { Timeline } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CheckBadgeIcon, PlusIcon } from '@heroicons/react/24/solid';
import { showNotification } from '@mantine/notifications';
import { closeAllModals } from '@mantine/modals';
import { useRouter } from 'next/router';
import { Status } from '../../status';

interface Props {
  wsId: string;
  eventId: string;
}

interface Progress {
  removed: Status;
}

const CalendarEventDeleteModal = ({ wsId, eventId }: Props) => {
  const router = useRouter();

  const [progress, setProgress] = useState<Progress>({
    removed: 'idle',
  });

  const hasError = progress.removed === 'error';
  const hasSuccess = progress.removed === 'success';

  useEffect(() => {
    if (!hasSuccess) return;

    showNotification({
      title: 'Thành công',
      message: 'Đã xoá sự kiện',
      color: 'green',
    });
  }, [hasSuccess, eventId]);

  const removeDetails = async () => {
    const res = await fetch(
      `/api/workspaces/${wsId}/calendar/events/${eventId}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      setProgress((progress) => ({ ...progress, removed: 'success' }));
      const { id } = await res.json();
      return id;
    } else {
      showNotification({
        title: 'Lỗi',
        message: 'Không thể xoá sự kiện',
        color: 'red',
      });
      setProgress((progress) => ({ ...progress, removed: 'error' }));
      return false;
    }
  };

  const handleDelete = async () => {
    if (!eventId) return;

    setProgress((progress) => ({ ...progress, removed: 'loading' }));
    removeDetails();
  };

  const [started, setStarted] = useState(false);

  return (
    <>
      <Timeline
        active={progress.removed === 'success' ? 1 : 0}
        bulletSize={32}
        lineWidth={4}
        color={started ? 'green' : 'gray'}
        className="mt-2"
      >
        <Timeline.Item
          bullet={<PlusIcon className="h-5 w-5" />}
          title="Xoá sự kiện"
        >
          {progress.removed === 'success' ? (
            <div className="text-green-300">Đã xoá sự kiện</div>
          ) : progress.removed === 'error' ? (
            <div className="text-red-300">Không thể xoá sự kiện</div>
          ) : progress.removed === 'loading' ? (
            <div className="text-blue-300">Đang xoá sự kiện</div>
          ) : (
            <div className="text-zinc-400/80">Đang chờ xoá sự kiện</div>
          )}
        </Timeline.Item>

        <Timeline.Item
          title="Hoàn tất"
          bullet={<CheckBadgeIcon className="h-5 w-5" />}
          lineVariant="dashed"
        >
          {progress.removed === 'success' ? (
            <div className="text-green-300">Đã hoàn tất</div>
          ) : hasError ? (
            <div className="text-red-300">Đã huỷ hoàn tất</div>
          ) : (
            <div className="text-zinc-400/80">Đang chờ hoàn tất</div>
          )}
        </Timeline.Item>
      </Timeline>

      <div className="mt-4 flex justify-end gap-2">
        {started || (
          <button
            className="rounded border border-zinc-300/10 bg-zinc-300/10 px-4 py-1 font-semibold text-zinc-300 transition hover:bg-zinc-300/20"
            onClick={() => closeAllModals()}
          >
            Huỷ
          </button>
        )}

        <button
          className={`rounded border px-4 py-1 font-semibold transition ${
            hasError
              ? 'border-red-300/10 bg-red-300/10 text-red-300 hover:bg-red-300/20'
              : hasSuccess
              ? 'border-green-300/10 bg-green-300/10 text-green-300 hover:bg-green-300/20'
              : started
              ? 'cursor-not-allowed border-zinc-300/10 bg-zinc-300/10 text-zinc-300/50'
              : 'border-blue-300/10 bg-blue-300/10 text-blue-300 hover:bg-blue-300/20'
          }`}
          onClick={() => {
            if (hasError) {
              closeAllModals();
              return;
            }

            if (hasSuccess) {
              router.push(`/${wsId}/calendar/events`);
              closeAllModals();
              return;
            }

            if (!started) {
              setStarted(true);
              handleDelete();
            }
          }}
        >
          {hasError
            ? 'Quay lại'
            : hasSuccess
            ? 'Hoàn tất'
            : started
            ? 'Đang tạo'
            : 'Bắt đầu'}
        </button>
      </div>
    </>
  );
};

export default CalendarEventDeleteModal;
