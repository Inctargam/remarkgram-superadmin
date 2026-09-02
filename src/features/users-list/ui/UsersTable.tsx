'use client'

import type { DropdownMenuItem } from '@remark-gram/ui-kit'
import {
  ArrowIosDownOutlineIcon,
  ArrowIosUpIcon,
  BlockIcon,
  DropdownMenu,
  MoreHorizontalOutlineIcon,
  Table,
} from '@remark-gram/ui-kit'

import type { User } from '@/entities/user'
import type { UsersListSortField } from '@/features/users-list/model'
import { formatShortDate } from '@/shared/lib/date'

import styles from './usersTable.module.css'

const COLUMN_COUNT = 5
const SKELETON_ROWS = 8
const EMPTY_MESSAGE = 'Users not found.'

const buildUserActionItems = (
  user: User,
  onMoreInfoClick: (user: User) => void,
  onDeleteClick: (user: User) => void
): DropdownMenuItem[] => [
  {
    id: 'toggle-ban',
    label: user.userBan ? 'Unban user' : 'Ban user',
    onSelect: () => {},
  },
  {
    id: 'delete',
    label: 'Delete user',
    danger: true,
    onSelect: () => onDeleteClick(user),
  },
]

type SortArrowsProps = {
  active: boolean
  direction: 'asc' | 'desc'
}

const SortArrows = ({ active, direction }: SortArrowsProps) => (
  <span className={styles.sortArrows}>
    <ArrowIosUpIcon
      className={active && direction === 'asc' ? styles.sortArrowActive : undefined}
      size={12}
    />
    <ArrowIosDownOutlineIcon
      className={active && direction === 'desc' ? styles.sortArrowActive : undefined}
      size={12}
    />
  </span>
)

type Props = {
  isLoading: boolean
  sortBy: UsersListSortField
  sortDirection: 'asc' | 'desc'
  users: User[]
  onDeleteClick: (user: User) => void
  onMoreInfoClick: (user: User) => void
  onToggleSort: (field: UsersListSortField) => void
}

export const UsersTable = ({
  isLoading,
  sortBy,
  sortDirection,
  users,
  onDeleteClick,
  onMoreInfoClick,
  onToggleSort,
}: Props) => {
  return (
    <Table.Root className={styles.table} wrapperClassName={styles.wrapper} aria-busy={isLoading}>
      <Table.Head className={styles.head}>
        <Table.Row className={styles.row}>
          <Table.HeadCell className={styles.idCell}>User ID</Table.HeadCell>
          <Table.HeadCell className={styles.linkCell}>
            <button
              aria-label="Sort by profile link"
              className={styles.sortButton}
              type="button"
              onClick={() => onToggleSort('userName')}>
              Profile link
              <SortArrows active={sortBy === 'userName'} direction={sortDirection} />
            </button>
          </Table.HeadCell>
          <Table.HeadCell className={styles.usernameCell}>Username</Table.HeadCell>
          <Table.HeadCell className={styles.dateCell}>
            <button
              aria-label="Sort by date added"
              className={styles.sortButton}
              type="button"
              onClick={() => onToggleSort('createdAt')}>
              Date added
              <SortArrows active={sortBy === 'createdAt'} direction={sortDirection} />
            </button>
          </Table.HeadCell>
          <Table.HeadCell className={styles.actionsCell}>
            <span className={styles.srOnly}>Actions</span>
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {isLoading ? <Table.Skeleton columns={COLUMN_COUNT} rows={SKELETON_ROWS} /> : null}

        {!isLoading && users.length === 0 ? (
          <Table.Empty colSpan={COLUMN_COUNT}>{EMPTY_MESSAGE}</Table.Empty>
        ) : null}

        {!isLoading &&
          users.map((user) => {
            const fullName = [user.profile.firstName, user.profile.lastName]
              .filter(Boolean)
              .join(' ')
            const actionItems = buildUserActionItems(user, onMoreInfoClick, onDeleteClick)

            return (
              <Table.Row key={user.id} className={styles.row}>
                <Table.Cell className={styles.idCell}>
                  {user.userBan ? (
                    <BlockIcon className={styles.blockIcon} aria-hidden size={24} />
                  ) : null}
                  {user.id}
                </Table.Cell>
                <Table.Cell className={styles.linkCell}>{user.userName}</Table.Cell>
                <Table.Cell className={styles.usernameCell}>{fullName || user.userName}</Table.Cell>
                <Table.Cell className={styles.dateCell}>
                  {formatShortDate(user.createdAt)}
                </Table.Cell>
                <Table.Cell className={styles.actionsCell}>
                  <DropdownMenu
                    ariaLabel={`User ${user.userName} actions`}
                    className={styles.actionsMenu}
                    items={actionItems}
                    trigger={<MoreHorizontalOutlineIcon size={24} aria-hidden />}
                    triggerClassName={styles.actionsTrigger}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
      </Table.Body>
    </Table.Root>
  )
}
