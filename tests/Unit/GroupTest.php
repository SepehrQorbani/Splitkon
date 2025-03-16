<?php

namespace Tests\Unit;

use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GroupTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_generates_unique_view_and_edit_tokens_on_creation()
    {
        $group = Group::create([
            'title' => 'Test Group',
            'description' => 'Test Description',
        ]);

        $this->assertNotNull($group->view_token);
        $this->assertNotNull($group->edit_token);
        $this->assertEquals(32, strlen($group->view_token));
        $this->assertEquals(32, strlen($group->edit_token));
        $this->assertNotEquals($group->view_token, $group->edit_token);
    }

    #[Test]
    public function it_has_members_relationship()
    {
        $group = Group::create(['title' => 'Test Group']);
        $group->members()->create([
            'name' => 'Sepehr',
            'ratio' => 50,
        ]);

        $this->assertCount(1, $group->members);
        $this->assertEquals('Sepehr', $group->members->first()->name);
    }
}
