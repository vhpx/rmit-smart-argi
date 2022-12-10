import {
  BanknotesIcon as MoneyIconSolid,
  CalendarDaysIcon as CalendarIconSolid,
  ClipboardDocumentListIcon as TaskIconSolid,
  Cog6ToothIcon as SettingsIconSolid,
  HomeIcon as HomeIconSolid,
  InboxIcon,
  PencilIcon,
  PlusIcon as PlusIconSolid,
} from '@heroicons/react/24/solid';

import {
  BanknotesIcon as MoneyIconOutline,
  CalendarDaysIcon as CalendarIconOutline,
  ClipboardDocumentListIcon as TaskIconOutline,
  Cog6ToothIcon as SettingsIconOutline,
  HomeIcon as HomeIconOutline,
  FolderPlusIcon,
  SquaresPlusIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import SidebarTab from './SidebarTab';
import Logo from '../common/Logo';
import { SidebarProps } from '../../types/SidebarProps';
import { useAppearance } from '../../hooks/useAppearance';
import {
  Accordion,
  AccordionControlProps,
  Avatar,
  Checkbox,
  Indicator,
  Loader,
  Menu,
  Select,
  Tooltip,
} from '@mantine/core';
import { useUser } from '@supabase/auth-helpers-react';
import { useUserData } from '../../hooks/useUserData';
import SidebarDivider from './SidebarDivider';
import { useOrgs } from '../../hooks/useOrganizations';
import OrgEditForm from '../forms/OrgEditForm';
import { openConfirmModal, openModal } from '@mantine/modals';
import { Organization } from '../../types/primitives/Organization';
import Link from 'next/link';
import { getInitials } from '../../utils/name-helper';
import { useEffect, useState } from 'react';
import { TaskBoard } from '../../types/primitives/TaskBoard';
import BoardEditForm from '../forms/BoardEditForm';
import useSWR, { mutate } from 'swr';
import { TaskList } from '../../types/primitives/TaskList';
import TaskListEditForm from '../forms/TaskListEditForm';
import { Task } from '../../types/primitives/Task';
import TaskEditForm from '../forms/TaskEditForm';

function LeftSidebar({ className }: SidebarProps) {
  const { leftSidebarPref, changeLeftSidebarPref } = useAppearance();
  const user = useUser();
  const { data } = useUserData();

  const { isLoading: isOrgsLoading, orgs, createOrg } = useOrgs();

  const addOrg = (org: Organization) => createOrg(org);

  const showEditOrgModal = () => {
    openModal({
      title: 'New organization',
      centered: true,
      children: <OrgEditForm onSubmit={addOrg} />,
    });
  };

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const { data: boards, error: boardsError } = useSWR<TaskBoard[] | null>(
    user?.id ? '/api/tasks/boards' : null
  );

  const { data: lists, error: listsError } = useSWR<TaskList[] | null>(
    user?.id && selectedBoardId
      ? `/api/tasks/lists?boardId=${selectedBoardId}`
      : null
  );

  const { data: tasks, error: tasksError } = useSWR<Task[] | null>(
    user?.id && selectedListId ? `/api/tasks?listId=${selectedListId}` : null
  );

  const isBoardsLoading = !boards && !boardsError;
  const isListsLoading = !lists && !listsError;
  const isTasksLoading = !tasks && !tasksError;

  // Automatically select the first board if none is selected
  useEffect(() => {
    const boardsSelected = !!selectedBoardId;

    if (!boards || boards.length === 0) {
      setSelectedBoardId(null);
      return;
    }

    const firstBoardId = boards[0].id;
    if (!boardsSelected) setSelectedBoardId(firstBoardId);
  }, [boards, boards?.length, selectedBoardId]);

  const addBoard = async (board: TaskBoard) => {
    const res = await fetch('/api/tasks/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: board.name,
      }),
    });

    if (res.ok) {
      mutate('/api/tasks/boards');
      const newBoard = await res.json();
      setSelectedBoardId(newBoard.id);
    }
  };

  const updateBoard = async (board: TaskBoard) => {
    const res = await fetch(`/api/tasks/boards/${board.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: board.name,
      }),
    });

    if (res.ok) {
      mutate('/api/tasks/boards');
    }
  };

  const deleteBoard = async (board: TaskBoard) => {
    const res = await fetch(`/api/tasks/boards/${board.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      mutate('/api/tasks/boards');
      setSelectedBoardId(null);
    }
  };

  const showEditBoardModal = (board?: TaskBoard) => {
    openModal({
      title: board ? 'Edit board' : 'New board',
      centered: true,
      children: (
        <BoardEditForm
          board={board}
          onSubmit={board ? updateBoard : addBoard}
        />
      ),
    });
  };

  const showDeleteBoardModal = (board?: TaskBoard) => {
    if (!board) return;
    openConfirmModal({
      title: (
        <div className="font-semibold">
          Delete {'"'}
          <span className="font-bold text-purple-300">{board.name}</span>
          {'" '}
          board
        </div>
      ),
      centered: true,
      children: (
        <div className="p-4 text-center">
          <p className="text-lg font-medium text-zinc-300">
            Are you sure you want to delete this board?
          </p>
          <p className="text-sm text-zinc-500">
            All of your data will be permanently removed. This action cannot be
            undone.
          </p>
        </div>
      ),
      onConfirm: () => deleteBoard(board),
      closeOnConfirm: true,
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    });
  };

  const addList = async (list: TaskList) => {
    if (!selectedBoardId) return;

    const res = await fetch('/api/tasks/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: list.name,
        boardId: selectedBoardId,
      }),
    });

    if (res.ok) mutate(`/api/tasks/lists?boardId=${selectedBoardId}`);
  };

  const updateList = async (list: TaskList) => {
    if (!selectedBoardId) return;

    const res = await fetch(`/api/tasks/lists/${list.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: list.name,
      }),
    });

    if (res.ok) mutate(`/api/tasks/lists?boardId=${selectedBoardId}`);
  };

  const deleteList = async (listId: string) => {
    if (!selectedBoardId) return;

    const res = await fetch(`/api/tasks/lists/${listId}`, {
      method: 'DELETE',
    });

    if (res.ok) mutate(`/api/tasks/lists?boardId=${selectedBoardId}`);
  };

  const showEditListModal = (boardId: string, list?: TaskList) => {
    openModal({
      title: list ? 'Edit list' : 'New list',
      centered: true,
      children: (
        <TaskListEditForm
          list={list}
          boardId={boardId}
          onSubmit={list ? updateList : addList}
        />
      ),
    });
  };

  const showDeleteListModal = (list: TaskList) => {
    if (!list) return;
    openConfirmModal({
      title: (
        <div className="font-semibold">
          Delete {'"'}
          <span className="font-bold text-purple-300">{list.name}</span>
          {'" '}
          list
        </div>
      ),
      centered: true,
      children: (
        <div className="p-4 text-center">
          <p className="text-lg font-medium text-zinc-300">
            Are you sure you want to delete this list?
          </p>
          <p className="text-sm text-zinc-500">
            All of your data will be permanently removed. This action cannot be
            undone.
          </p>
        </div>
      ),
      onConfirm: () => deleteList(list.id),
      closeOnConfirm: true,
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    });
  };

  const addTask = async (task: Task) => {
    if (!selectedBoardId || !selectedListId) return;

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: task.name,
        listId: selectedListId,
      }),
    });

    if (res.ok) mutate(`/api/tasks?listId=${selectedListId}`);
  };

  const updateTask = async (task: Task) => {
    if (!selectedBoardId || !selectedListId) return;

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: task.name,
        completed: task.completed,
      }),
    });

    if (res.ok) mutate(`/api/tasks?listId=${selectedListId}`);
  };

  const deleteTask = async (taskId: string) => {
    if (!selectedBoardId || !selectedListId) return;

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (res.ok) mutate(`/api/tasks?listId=${selectedListId}`);
  };

  const setTaskCompletion = async (task: Task) => {
    if (!task.id) return;

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    if (res.ok) mutate(`/api/tasks?listId=${selectedListId}`);
  };

  const showEditTaskModal = (listId: string, task?: Task) => {
    openModal({
      title: task ? 'Edit task' : 'New task',
      centered: true,
      children: (
        <TaskEditForm
          task={task}
          listId={listId}
          onSubmit={task ? updateTask : addTask}
        />
      ),
    });
  };

  const showDeleteTaskModal = (task: Task) => {
    if (!task) return;
    openConfirmModal({
      title: (
        <div className="font-semibold">
          Delete {'"'}
          <span className="font-bold text-purple-300">{task.name}</span>
          {'" '}
          task
        </div>
      ),
      centered: true,
      children: (
        <div className="p-4 text-center">
          <p className="text-lg font-medium text-zinc-300">
            Are you sure you want to delete this task?
          </p>
          <p className="text-sm text-zinc-500">
            All of your data will be permanently removed. This action cannot be
            undone.
          </p>
        </div>
      ),
      onConfirm: () => deleteTask(task.id),
      closeOnConfirm: true,
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    });
  };

  const getBoard = (id?: string | null) =>
    boards?.find((b) => b.id === id) || boards?.[0];

  function AccordionControl(props: AccordionControlProps & { list: TaskList }) {
    const { list, ...rest } = props;

    return (
      <div className="mr-3.5 flex items-center gap-1">
        <Accordion.Control {...rest} />
        <Menu openDelay={100} closeDelay={400} withArrow position="right">
          <Menu.Target>
            <button className="rounded border border-transparent text-zinc-500 transition hover:border-blue-300/30 hover:bg-blue-500/30 hover:text-blue-300">
              <EllipsisHorizontalIcon className="w-6" />
            </button>
          </Menu.Target>

          <Menu.Dropdown className="font-semibold">
            <Menu.Item icon={<InboxIcon className="w-6" />} disabled>
              Archived tasks
            </Menu.Item>
            <Menu.Item
              icon={<SettingsIconSolid className="w-6" />}
              onClick={() => showEditListModal(list.board_id, list)}
            >
              List settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              icon={<TrashIcon className="w-6" />}
              color="red"
              onClick={() => showDeleteListModal(list)}
            >
              Delete list
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    );
  }

  return (
    <>
      <div
        className={`${className} group fixed top-0 left-0 z-20 flex h-full items-start justify-center bg-zinc-900 backdrop-blur-lg ${
          leftSidebarPref.main === 'open'
            ? 'opacity-100'
            : 'pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100'
        } transition-all duration-300`}
      >
        <div className="flex h-full w-16 flex-col border-r border-zinc-800/80 pt-6 pb-2">
          <div className="relative mx-3 flex justify-start pl-[0.2rem] pb-1">
            <Logo
              alwaysShowLabel={leftSidebarPref.main === 'open'}
              showLabel={leftSidebarPref.main !== 'closed'}
            />
          </div>

          <div className="h-8" />

          <div className="h-full overflow-auto">
            <div className="flex flex-col items-start gap-6 p-4">
              <SidebarTab
                href="/"
                activeIcon={<HomeIconSolid className="w-8" />}
                inactiveIcon={<HomeIconOutline className="w-8" />}
                label="Home"
                showTooltip={leftSidebarPref.main === 'closed'}
              />
              <SidebarTab
                href="/calendar"
                activeIcon={<CalendarIconSolid className="w-8" />}
                inactiveIcon={<CalendarIconOutline className="w-8" />}
                label="Calendar"
                showTooltip={leftSidebarPref.main === 'closed'}
              />
              <SidebarTab
                href="/tasks"
                activeIcon={<TaskIconSolid className="w-8" />}
                inactiveIcon={<TaskIconOutline className="w-8" />}
                label="Tasks"
                showTooltip={leftSidebarPref.main === 'closed'}
              />
              <SidebarTab
                href="/expenses"
                activeIcon={<MoneyIconSolid className="w-8" />}
                inactiveIcon={<MoneyIconOutline className="w-8" />}
                label="Expenses"
                showTooltip={leftSidebarPref.main === 'closed'}
              />
            </div>

            <SidebarDivider />

            {isOrgsLoading || (
              <div className="flex flex-col gap-3 p-4">
                {orgs?.current?.map((org) => (
                  <SidebarTab
                    key={org.id}
                    href={`/orgs/${org.id}`}
                    inactiveIcon={
                      <div className="rounded border border-blue-300/30 transition hover:border-blue-300/40 hover:bg-zinc-300/10">
                        <Avatar color="blue" radius="sm">
                          {getInitials(org?.name ?? 'Unknown')}
                        </Avatar>
                      </div>
                    }
                    label={org.name}
                    showTooltip={leftSidebarPref.main === 'closed'}
                    enableOffset
                  />
                ))}

                <SidebarTab
                  onClick={showEditOrgModal}
                  activeIcon={
                    <div className="rounded border border-zinc-700 p-0.5 transition hover:border-purple-300/20 hover:bg-purple-300/20 hover:text-purple-300">
                      <PlusIconSolid className="w-8" />
                    </div>
                  }
                  label="New Organization"
                  showTooltip={leftSidebarPref.main === 'closed'}
                  className={
                    leftSidebarPref.main === 'closed'
                      ? 'translate-x-[-0.03rem]'
                      : 'translate-x-[-0.22rem]'
                  }
                />
              </div>
            )}

            <SidebarDivider />
          </div>

          <div className="flex flex-col items-start gap-3 px-4 pb-2">
            <SidebarTab
              href="/settings"
              activeIcon={<SettingsIconSolid className="w-8" />}
              inactiveIcon={<SettingsIconOutline className="w-8" />}
              label="Settings"
              showTooltip={leftSidebarPref.main === 'closed'}
            />

            <Link
              href="/settings"
              className={`${
                leftSidebarPref.main !== 'closed'
                  ? '-translate-x-1 justify-start'
                  : 'justify-center self-center'
              } relative flex w-full items-center transition duration-300`}
            >
              <Tooltip
                label={
                  <div className="font-semibold">
                    <div>{data?.displayName || 'Unknown'}</div>
                    {data?.username && (
                      <div className="text-blue-300">@{data.username}</div>
                    )}
                  </div>
                }
                disabled={
                  !data?.displayName || leftSidebarPref.main !== 'closed'
                }
                position="right"
                color="#182a3d"
                offset={20}
                withArrow
              >
                <div className="flex items-end gap-2">
                  <Indicator
                    color="green"
                    position="bottom-end"
                    size={12}
                    offset={5}
                    withBorder
                  >
                    <Avatar color="blue" radius="xl">
                      {getInitials(data?.displayName ?? 'Unknown')}
                    </Avatar>
                  </Indicator>

                  <div
                    className={
                      leftSidebarPref.main === 'closed'
                        ? 'md:hidden'
                        : leftSidebarPref.main === 'auto'
                        ? 'opacity-0 transition duration-300 group-hover:opacity-100'
                        : ''
                    }
                  >
                    <div className="text-md min-w-max font-bold">
                      {data?.displayName ||
                        user?.email ||
                        user?.phone ||
                        'Not logged in'}
                    </div>
                    {data?.username && (
                      <div className="min-w-max text-sm font-semibold text-blue-300">
                        @{data?.username}
                      </div>
                    )}
                  </div>
                </div>
              </Tooltip>
            </Link>
          </div>
        </div>

        {leftSidebarPref.secondary === 'visible' &&
          (isBoardsLoading ? (
            <div className="hidden h-full w-full flex-col items-center justify-center gap-4 border-r border-zinc-800/80 p-8 text-center md:flex">
              <Loader />
            </div>
          ) : !boards || boards?.length === 0 ? (
            <div className="hidden h-full w-full flex-col items-center justify-center gap-4 border-r border-zinc-800/80 p-8 text-center md:flex">
              <div className="text-lg font-semibold">
                Start organizing your tasks in a miraculous way.
              </div>
              <button
                onClick={() => showEditBoardModal()}
                className="rounded-lg bg-purple-300/20 px-4 py-2 text-lg font-semibold text-purple-300 transition hover:bg-purple-300/30"
              >
                Create a board
              </button>
            </div>
          ) : (
            <div className="relative hidden h-full w-full flex-col border-r border-zinc-800/80 pt-6 md:flex">
              <div className="relative mx-3 flex gap-2 text-2xl font-semibold">
                <Select
                  defaultValue={selectedBoardId || boards?.[0]?.id}
                  data={
                    boards?.map((board: TaskBoard) => ({
                      value: board.id,
                      label: board.name || 'Untitled',
                    })) ?? []
                  }
                  value={
                    boards.some((board) => board.id === selectedBoardId)
                      ? selectedBoardId
                      : boards?.[0]?.id
                  }
                  onChange={setSelectedBoardId}
                  className="w-full"
                />
                <div className="flex gap-1">
                  {selectedBoardId && (
                    <Menu openDelay={100} closeDelay={400} withArrow>
                      <Menu.Target>
                        <button className="rounded border border-transparent p-1 transition hover:border-blue-300/30 hover:bg-blue-500/30 hover:text-blue-300">
                          <PlusIconSolid className="w-6" />
                        </button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          icon={<SquaresPlusIcon className="w-6" />}
                          onClick={() => showEditBoardModal()}
                        >
                          New board
                        </Menu.Item>

                        <Menu.Item
                          icon={<FolderPlusIcon className="w-6" />}
                          onClick={() => showEditListModal(selectedBoardId)}
                        >
                          New task list
                        </Menu.Item>

                        {/* <Menu.Item
                          icon={<PlusCircleIcon className="w-6" />}
                          disabled
                        >
                          New task
                        </Menu.Item> */}
                      </Menu.Dropdown>
                    </Menu>
                  )}

                  <Menu openDelay={100} closeDelay={400} withArrow>
                    <Menu.Target>
                      <button className="rounded border border-transparent p-1 transition hover:border-blue-300/30 hover:bg-blue-500/30 hover:text-blue-300">
                        <EllipsisHorizontalIcon className="w-6" />
                      </button>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item icon={<InboxIcon className="w-6" />} disabled>
                        Archived lists
                      </Menu.Item>
                      <Menu.Item
                        icon={<SettingsIconSolid className="w-6" />}
                        onClick={() =>
                          showEditBoardModal(getBoard(selectedBoardId))
                        }
                      >
                        Board settings
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        icon={<TrashIcon className="w-6" />}
                        color="red"
                        onClick={() =>
                          showDeleteBoardModal(getBoard(selectedBoardId))
                        }
                      >
                        Delete board
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              </div>

              <SidebarDivider padBottom={false} />

              {isListsLoading ? (
                <div className="flex h-full items-center justify-center overflow-auto p-8 text-center text-xl font-semibold text-zinc-400/80">
                  <Loader />
                </div>
              ) : lists?.length === 0 ? (
                <div className="flex h-full items-center justify-center overflow-auto p-8 text-center text-xl font-semibold text-zinc-400/80">
                  Create a task list to get started
                </div>
              ) : (
                <Accordion
                  value={selectedListId}
                  onChange={setSelectedListId}
                  chevronPosition="left"
                  radius="lg"
                  className="flex flex-col overflow-auto scrollbar-none"
                >
                  {lists?.map((list) => (
                    <Accordion.Item key={list.id} value={list.id}>
                      <AccordionControl list={list}>
                        <div className="font-semibold">
                          {list.name || 'Untitled list'}
                        </div>
                      </AccordionControl>
                      <Accordion.Panel>
                        {isTasksLoading ? (
                          <div className="p-2" />
                        ) : (
                          <div className="grid">
                            {tasks &&
                              tasks
                                .sort((a, b) => {
                                  if (a.completed && !b.completed) return 1;
                                  if (!a.completed && b.completed) return -1;
                                  return 0;
                                })
                                .map((task) => (
                                  <div
                                    key={task.id}
                                    className="relative rounded-lg p-2 hover:bg-zinc-800"
                                  >
                                    <Checkbox
                                      label={
                                        <div
                                          className={
                                            task.completed
                                              ? 'text-zinc-700 line-through'
                                              : ''
                                          }
                                        >
                                          {task.name || 'Untitled task'}
                                        </div>
                                      }
                                      checked={task.completed}
                                      onChange={() => setTaskCompletion(task)}
                                      className="flex"
                                    />

                                    <div className="absolute inset-y-1 right-1 flex gap-1 opacity-0 transition duration-300 group-hover:opacity-100">
                                      <Menu
                                        openDelay={100}
                                        closeDelay={400}
                                        withArrow
                                        position="left"
                                      >
                                        <Menu.Target>
                                          <button className="rounded border border-transparent text-zinc-500 transition hover:border-blue-300/30 hover:bg-blue-500/30 hover:text-blue-300">
                                            <EllipsisHorizontalIcon className="w-6" />
                                          </button>
                                        </Menu.Target>

                                        <Menu.Dropdown className="font-semibold">
                                          <Menu.Item
                                            icon={
                                              <PencilIcon className="w-6" />
                                            }
                                            onClick={() =>
                                              showEditTaskModal(list.id, task)
                                            }
                                          >
                                            Edit task
                                          </Menu.Item>
                                          <Menu.Item
                                            icon={<TrashIcon className="w-6" />}
                                            color="red"
                                            onClick={() =>
                                              showDeleteTaskModal(task)
                                            }
                                          >
                                            Delete task
                                          </Menu.Item>
                                        </Menu.Dropdown>
                                      </Menu>
                                    </div>
                                  </div>
                                ))}
                            <button
                              className="flex items-center gap-3 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-400"
                              onClick={() => showEditTaskModal(list.id)}
                            >
                              <PlusIconSolid className="w-5" />
                              <div className="text-sm font-semibold">Task</div>
                            </button>
                          </div>
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </div>
          ))}
      </div>

      <div
        className={`z-10 h-screen w-screen bg-zinc-900/50 backdrop-blur md:hidden ${
          leftSidebarPref.main === 'open' ? 'block' : 'hidden'
        }`}
        onClick={() =>
          changeLeftSidebarPref({ main: 'closed', secondary: 'hidden' })
        }
      />
    </>
  );
}

export default LeftSidebar;
